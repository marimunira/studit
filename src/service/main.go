package main

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"log"
	_ "github.com/lib/pq"
	_ "service/routers"
)

func init() {
	err := orm.RegisterDataBase("default", "postgres", "postgres://postgres:postgres@localhost:5432/studit?sslmode=disable")
	if err != nil {
		log.Fatal(err.Error())
	}
}

func main() {
	if beego.BConfig.RunMode == "dev" {
		beego.BConfig.WebConfig.DirectoryIndex = true
		beego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"
	}
	beego.Run()
}
