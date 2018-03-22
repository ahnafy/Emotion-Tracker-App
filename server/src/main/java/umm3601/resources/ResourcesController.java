package umm3601.resources;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;
import java.util.Iterator;
import java.util.Map;


import java.util.Date;

import static com.mongodb.client.model.Filters.eq;

public class ResourcesController {
    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> resourcesCollection;

    /**
     * Construct a controller for goals.
     *
     * @param database the database containing goals data
     */
    public ResourcesController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        resourcesCollection = database.getCollection("resources");
    }

    public String getResourcesID(String id) {

        FindIterable<Document> jsonResourcess
            = resourcesCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonResourcess.iterator();
        if (iterator.hasNext()) {
            Document resource = iterator.next();
            return resource.toJson();
        } else {
            // We didn't find the desired Goal
            return null;
        }
    }


    public String getResources(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("name")) {
            String targetName = (queryParams.get("name")[0]);
            filterDoc = filterDoc.append("name", targetName);
        }

        FindIterable<Document> matchingResourcess = resourcesCollection.find(filterDoc);


        return JSON.serialize(matchingResourcess);
    }


    public String addNewResources(String ownerId, String name, String email, String phonenumber) {

        Document newResources = new Document();
        newResources.append("name", name);
        newResources.append("email", email);
        newResources.append("phonenumber", phonenumber);


        try {
            resourcesCollection.insertOne(newResources);

            ObjectId id = newResources.getObjectId("_id");
            System.err.println("Successfully added new resource [_id=" + id + ", name=" + name + ", email=" + email + " phonenumber=" + phonenumber + ']');

            return JSON.serialize(id);
        } catch (MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
