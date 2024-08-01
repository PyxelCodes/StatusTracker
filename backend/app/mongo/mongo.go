package stmongo

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("No .env file found")
	}
}

type Mongo struct {
	Client *mongo.Client
}

func Initialize() *Mongo {
	log.Println("Initializing MongoDB")
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("MONGODB_URI is not set")
	}

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	return &Mongo{
		Client: client,
	}
}

func Close(m *Mongo) {
	if err := m.Client.Disconnect(context.TODO()); err != nil {
		log.Fatalf("Error disconnecting from MongoDB: %v", err)
	}
	log.Println("Disconnected from MongoDB")
}

func FindUser(client *mongo.Client, id string) bson.M {
	coll := client.Database("production").Collection("users")

	var result bson.M
	err := coll.FindOne(context.TODO(), bson.D{{Key: "_id", Value: id}}, options.FindOne().SetProjection(bson.D{{Key: "__v", Value: 0}})).Decode(&result)
	if err != nil {
		log.Fatal(err)
	}

	return result
}

func FindActivities(client *mongo.Client, id string) []bson.M {
	coll := client.Database("production").Collection("activities")

	cursor, err := coll.Find(context.TODO(), bson.D{{Key: "id", Value: id}}, options.Find().SetProjection(bson.D{{Key: "__v", Value: 0}, {Key: "_id", Value: 0}}))
	if err != nil {
		log.Fatal(err)
	}

	var results []bson.M
	if err = cursor.All(context.TODO(), &results); err != nil {
		log.Fatal(err)
	}

	return results
}
