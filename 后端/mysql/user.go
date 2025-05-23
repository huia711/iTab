package mysql

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
)

var (
	DB *gorm.DB
)

func Init(hostname string, port int, username string, password string, dbname string) (*gorm.DB, error) {
	db, err := gorm.Open("mysql",
		fmt.Sprintf("%s:%s@(%s:%d)/%s?charset=utf8&parseTime=True&loc=Local",
			username, password, hostname, port, dbname))
	if err != nil {
		return nil, err
	}
	DB = db
	return db, nil
}
