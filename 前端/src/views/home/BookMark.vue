<template>
  <!-- 顶部网站导航组件 -->
  <div class="bookmark-warp">
    <transition-group class="widget-grid">
      <li class='widget-item'>
      <!-- 小组件：日历 -->
      <el-card
          v-if="pageNow === 2"
          class="widget-calendar"
          shadow="hover"
          :body-style="{ padding: '0px' }"
      >
        <CalendarItem/>
      </el-card>

      <!-- 小组件:热搜 -->
      <el-card
          v-if="pageNow === 3"
          class="widget"
          shadow="hover"
          :body-style="{ padding: '0px' }"
      >
        <TableItem type="wbHot"/>
      </el-card>
      <el-card
          v-if="pageNow === 3"
          class="widget"
          shadow="hover"
          :body-style="{ padding: '0px' }"
      >
        <TableItem type="bili"/>
      </el-card>

      <!-- 小组件:热搜 -->
      <el-card
          v-if="pageNow === 4"
          class="widget"
          shadow="hover"
          :body-style="{ padding: '0px' }"
      >
        <TableItem type="zhihuHot"/>
      </el-card>
      <el-card
          v-if="pageNow === 4"
          class="widget"
          shadow="hover"
          :body-style="{ padding: '0px' }"
      >
        <TableItem type="itInfo"/>
      </el-card>
      </li>
    </transition-group>
    <!-- 过渡动画组件，实现顶部网站拖拽排序的动画效果 -->
    <!--tag="ul":将<transition-group>组件中的所有子元素渲染为HTML中的无序列表元素（ul)-->
    <transition-group class="bookmark-grid" name="flip-list" tag="ul">
      <!-- 循环渲染顶部网站列表中的每一项 -->
      <li
          v-for="(item, index) of bookMarks"
          :key="item.url"
          :class="['bookmark-item', { hide: data.currentDrag === index }]"
          :title="item.title"
      >
        <!-- 自定义图标组件，包括提示文本、图标、点击事件、拖拽事件，以及编辑状态下的删除按钮 -->
        <!--@contextmenu:监听右键-->
        <!--drag:监听拖拽事件 dragover:监听拖拽事件的过程中鼠标在目标元素上移动的事件-->
        <el-card
            :class="['bookmark-icon', { 'shake-active': data.shake }]"
            :body-style="{ padding: '0px' }"
            :title="item.title"
            draggable="true"
            shadow="hover"
            @click="openPage(item.url)"
            @contextmenu.prevent.stop="openEditStatus"
            @dragstart="onDragIcon(DragType.start, index)"
            @dragenter="onDragIcon(DragType.enter, index)"
            @dragover.prevent
            @dragend="onDragIcon(DragType.end, index)"
        >
          <icon
              :text-icon="item.textIcon"
              :src="item.icon"
              :title="item.title"
          />
          <!-- 组件过渡动画，当编辑状态打开时，出现删除按钮 -->
          <transition name="scale">
            <!--上标-->
            <sup
                v-show="data.editStatus"
                class="bubble-delete"
                @click.stop="deleteBookMark(index)"
            ></sup>
          </transition>
        </el-card>

        <div class="icon-title">
          <span>{{ item.title }}</span>
        </div>
      </li>

      <!-- 添加顶部网站图标的空白位置，如果还有空位就显示该项 -->
      <li
          v-if="checkPage()"
          v-show="!data.editStatus"
          class="bookmark-item"
          :title="t('bookmark.add')"
      >
        <el-card
            class="bookmark-icon"
            shadow="hover"
            @click="data.showAddModal = true"
            textIcon
        >
          <el-icon size="24"><Plus/></el-icon>
        </el-card>

        <div class="icon-title">
          <span>{{ t('bookmark.add') }}</span>
        </div>
      </li>
    </transition-group>

    <!-- 添加自定义顶部网站弹出框 -->
    <el-dialog
        v-model="data.showAddModal"
        :title="t('bookmark.add')"
        :width="500"
        centered
        destroy-on-close
        draggable
    >
      <!-- 表单组件，包含网站标题、网站 URL、自动获取图标开关、自定义图标 URL 等项 -->
      <el-form
          ref="ruleFormRef"
          :rules="rules"
          :model="bookMark"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
          status-icon
      >
        <el-form-item :label="t('bookmark.siteTitle')" prop="title">
          <el-input v-model="bookMark.title" :placeholder="t('bookmark.siteTitle')" />
        </el-form-item>
        <el-form-item :label="t('bookmark.siteURL')" prop="url" type="url">
          <el-input v-model="bookMark.url" :placeholder="t('bookmark.siteURL')" />
        </el-form-item>
        <el-form-item :label="t('bookmark.autoGet')">
          <el-switch v-model="bookMark.autoIcon" />
        </el-form-item>
        <el-form-item v-if="!bookMark.autoIcon" :label="t('bookmark.textIcon')">
          <el-switch v-model="bookMark.textIcon" />
        </el-form-item>
        <el-form-item
            v-if="!(bookMark.autoIcon || bookMark.textIcon)"
            :label="t('bookmark.iconURL')"
            prop="icon"
            type="url"
        >
          <el-input v-model="bookMark.icon" :placeholder="t('bookmark.iconURL')" />
        </el-form-item>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel(ruleFormRef)">
          {{ t('bookmark.cancel') }}
        </el-button>
        <el-button type="primary" @click="onSaveCustomBookMark(ruleFormRef)">
          {{t('bookmark.OK')}}
        </el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup type="module">
  /**
   * 导入（import）
   */
  import { computed, onBeforeMount, reactive, ref } from "vue"
  import { useStore } from "@/store"
  import { BookMarkActions, BookMarkGetters, BookMarkMutations } from "@/store/bookmark"

  import { getFavicon } from "@/plugins/getIcon"

  // 外部导入
  import { DragType, OpenPageTarget, SortData, BookMarkItem, BookMarks } from "@/enum-interface"
  import { useI18n } from "vue-i18n"
  import { Plus } from "@element-plus/icons-vue"
  import type { FormInstance } from 'element-plus'
  import Icon from "@/components/IconItem.vue"
  import CalendarItem from "@/components/CalendarItem.vue";
  import TableItem from "@/components/TableItem.vue";


  /**
   * 常/变量（const/let）的定义
   */
  const { t } = useI18n()
  const { state, getters, commit, dispatch } = useStore()
  const ruleFormRef = ref<FormInstance>()

  /**
   * 响应式对象（reactive,computed）
   */
  const bookMarkSetting = computed(() => state.setting.bookMark)
  const bookMarks = computed<BookMarks>(() => getters[BookMarkGetters.getCurrentBookMarks])
  const userID = computed(() => state.settings.userId).value
  const pageNow = computed(() => state.bookMark.pageNow)
  const pageCount = computed(() => state.bookMark.pageCount)

  // 定义了三个响应式对象：data、bookMark和rules
  const data = reactive({
    currentDrag: -1,
    shake: false,
    editStatus: false,
    showAddModal: false
  })

  const bookMark = reactive({
    title: "",
    url: "",
    icon: "",
    textIcon: false,
    autoIcon: true,
    page: 1
  })

  const rules = reactive({
    title: [{ required: true, message: "请输入名称", trigger: 'blur' }],
    url: [{ required: true, message: "请输入地址URL", type: "url", trigger: 'blur' }],
    icon: [{ required: false, message: "请输入图标URL", type: "url", trigger: 'blur' }]
  })


  /**
   * 函数（function）定义
   */
  // 打开该网站的首页
  function openPage(url: string) {
    window.open('https://'+url, OpenPageTarget.Blank)
  }

  // 删除
  function deleteBookMark(index: number) {
    console.log(index)
    console.log(bookMarks)
    commit(BookMarkMutations.deleteBookMark, { index: index, userId: userID })
  }

  // 进入编辑状态
  function openEditStatus() {
    data.shake = true
    data.editStatus = true

    // 点击其他位置关闭编辑状态
    document.body.addEventListener("click", closeEditStatus)
  }

  // 关闭编辑状态
  function closeEditStatus(e: Event) {
    // 如果出于编辑状态
    if (data.editStatus) {
      e.stopPropagation() // 阻止事件传播

      data.shake = false // 重置抖动状态
      data.editStatus = false // 关闭编辑状态
      document.body.removeEventListener("click", closeEditStatus) // 移除事件监听器
    }
  }

  // 拖拽
  function onDragIcon(type: DragType, index: number) {
    const sortData: SortData = {
      from: -1,
      to: -1
    }
    switch (type) {
      // 开始
      case DragType.start:
        // 记录当前拖拽项的位置并打开编辑状态
        data.currentDrag = index
        openEditStatus()
        return

      // 进入
      case DragType.enter:
        // 如果当前拖拽项与进入项相同则返回
        if (data.currentDrag === index) return

        sortData.from = data.currentDrag
        sortData.to = index

        // 调用好的 mutations 方法进行排序
        commit(BookMarkMutations.sortBookMarks, { sort: sortData, userId: userID })
        data.currentDrag = index // 更新当前拖拽项位置
        return

      // 结束
      case DragType.end:
        data.currentDrag = -1 // 重置当前拖拽项位置
        return
    }
  }
  // 保存自定义置顶网站
  const onSaveCustomBookMark = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        console.log('submit!')
        // 如果设置自动获取图标，则获取该网站的图标地址
        const icon = bookMark.autoIcon ? getFavicon("http://"+bookMark.url) : bookMark.icon

        // 创建自定义置顶网站数据并添加到置顶网站列表中
        const customData: BookMarkItem = {
          ...bookMark,
          custom: true,
          icon: icon,
          page: pageNow.value
        }
        commit(BookMarkMutations.addBookMark, { data: customData, userId: userID })

        // 重置表单数据并关闭添加网站对话框
        formEl.resetFields()
        data.showAddModal = false
      } else {
        console.log('error submit!', fields)
      }
    })
  }

  // 取消提交
  const cancel = (formEl: FormInstance | undefined) => {
    // 重置表单数据并关闭添加网站对话框
    formEl.resetFields()
    data.showAddModal = false
  }

  //
  function checkPage() {
    if (pageNow.value === 1) {
      return pageCount.value[pageNow.value] < 12
    }
    if (pageNow.value === 2) {
      return false
    }
    else {
      console.log(pageCount.value[pageNow.value])
      return pageCount.value[pageNow.value] < 18
    }
  }

  // // 初始化应用程序
  // // init：检查应用程序内存储的数据中是否包含已有的顶部网站更新时间信息，如果没有，则调用TopSiteActions.syncBrowserTopSites异步函数从浏览器API中同步顶部网站数据。
  // async function init() {
  //   if (!state.bookMark.lastUpdateTime) {
  //     await dispatch(BookMarkActions.syncBrowserBookMarks)
  //   }
  // }
  //
  // /**
  //  * 生命周期函数onBeforeMount
  //  */
  // // onBeforeMount：生命周期函数之一，组件的实例被创建后，mounted生命周期函数被调用之前
  // // 组件挂载前执行，以确保在组件渲染前先初始化顶部网站数据
  // onBeforeMount(init)
</script>

<style lang="less">
  // 设置最大图标尺寸
  @item-size-max: 128px;
  // 设置顶部网站导航栏的列数和行数
  @col: v-bind("bookMarkSetting.col");
  // 设置图标之间的间距
  @gap: 42px;
  // 设置整个顶部网站导航栏的大小和背景颜色
  @board-size: v-bind("`${bookMarkSetting.boardSize}px`");
  @board-color: v-bind("bookMarkSetting.boardColor");
  @board-opacity: v-bind("bookMarkSetting.boardOpacity");
  @board-radius: 5px;

  // 定义样式规则
  .bookmark-warp {
    width: calc(@col * @item-size-max + (@col - 1) * @gap);

    display: grid;
    grid-row-gap: 42px;

    // 定义图标网格布局
    .bookmark-grid {
      display: grid;
      grid-template-columns: repeat(@col, @item-size-max); //  repeat():将 @col 个固定大小的列等分在容器中。
      gap: @gap;

      padding: 0;
    }

    // 定义图标的样式
    .bookmark-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      row-gap: 8px;

      // 定义“隐藏”类的样式（即不透明度为 0）
      &.hide {
        opacity: 0;
      }

      // 定义图标的进入和离开动画样式
      &.flip-list-enter-from,
      &.flip-list-leave-to {
        opacity: 0;
        transform: translateY(@board-size);
      }

      &.flip-list-enter-active,
      &.flip-list-leave-active,
      &.flip-list-move {
        transition: all 0.3s ease;
      }

      &.flip-list-enter-active {
        transition-delay: 0.3s;
      }

      // 定义图标本身的样式
      .bookmark-icon {
        width: @board-size;
        height: @board-size;
        cursor: pointer;

        // 定义抖动动画样式
        &.shake-active {
          animation: shake 0.3s infinite;
        }

        // 定义图标的删除按钮样式
        .bubble-delete {
          width: 18px;
          height: 18px;

          position: absolute;
          top: 0;
          right: 0;
          color: #f5f5f5;
          background-color: #f5222d;
          text-align: center;
          line-height: 18px;
          font-size: 12px;
          border-radius: 50%;

          // 设置删除按钮的文本内容为 "X"
          &::before {
            content: "X";
          }
        }
      }

      // 定义图标标题的样式
      .icon-title {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis; // 文本过长时显示省略号
        white-space: nowrap; // 防止文本换行
        max-width: @item-size-max;
        text-align: center; // 水平居中文本
        user-select: none; // 用户无法选中元素中的文本
      }
    }

    // 定义图标网格布局
    .widget-grid {
      display: grid;
      gap: @gap;
      padding: 0;
    }

    .widget-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      column-gap: 8px;

      // 定义图标的进入和离开动画样式
      &.flip-list-enter-from,
      &.flip-list-leave-to {
        opacity: 0;
        transform: translateY(@board-size);
      }

      &.flip-list-enter-active,
      &.flip-list-leave-active,
      &.flip-list-move {
        transition: all 0.3s ease;
      }

      &.flip-list-enter-active {
        transition-delay: 0.3s;
      }
    }

    //
    .widget {
      width: calc((@col * @item-size-max + (@col - 1) * @gap)/2 - 40);
      height: 320px;
      padding: 0;
      cursor: pointer;
    }

    .widget-calendar {
      width: calc((@col * @item-size-max + (@col - 1) * @gap)/2 - 40);
      padding: 0;
      cursor: pointer;
    }
  }

  @keyframes shake {
    0%,
    50%,
    100% {
      transform: rotate(0deg);
    }

    25% {
      transform: rotate(-4deg);
    }
    75% {
      transform: rotate(4deg);
    }
  }
  //// 定义深色主题下的样式规则
  //[data-theme="dark"] {
  //  .top-site-warp {
  //    .top-site-item {
  //      // 定义深色主题下的背景板颜色样式
  //      .icon-board {
  //        background-color: #1f1f1f !important;
  //        transition: background-color 0.3s ease;
  //      }
  //    }
  //  }
  //}
</style>


