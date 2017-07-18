package root

import (
	"main-service/queries"

	gql "github.com/graphql-go/graphql"
)

var RootQuery = gql.NewObject(
	gql.ObjectConfig{
		Name: "RootQuery",
		Fields: gql.Fields{
			"News":    &queries.GetNewsById,
			"User":    &queries.GetUserById,
			"Project": &queries.GetProjectById,
			"Auth":    &queries.Auth,
		},
	},
)
