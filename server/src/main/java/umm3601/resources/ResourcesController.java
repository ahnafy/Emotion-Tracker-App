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


import static com.mongodb.client.model.Filters.eq;

public class ResourcesController {
    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> resourcesCollection;

    /**
     * Construct a controller for resources.
     *
     * @param database the database containing resources data
     */
    public ResourcesController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        resourcesCollection = database.getCollection("resources");
    }

    public String getResources(String id) {

        FindIterable<Document> jsonResources
            = resourcesCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonResources.iterator();
        if (iterator.hasNext()) {
            Document resource = iterator.next();
            return resource.toJson();
        } else {
            // We didn't find the desired Resource
            return null;
        }
    }


    public String getResources(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("name")) {
            String targetName = (queryParams.get("name")[0]);
            Document contentRegQuery = new Document();
            contentRegQuery.append("$regex", targetName);
            contentRegQuery.append("$options", "i");
            filterDoc = filterDoc.append("name", targetName);
        }

        FindIterable<Document> matchingResources = resourcesCollection.find(filterDoc);


        return JSON.serialize(matchingResources);
    }


    public String addNewResources(String id, String name, String email, String phone) {

        Document newResources = new Document();
        newResources.append("name", name);
        newResources.append("email", email);
        newResources.append("phone", phone);




        try {
            resourcesCollection.insertOne(newResources);

            ObjectId Id = newResources.getObjectId("_id");
            System.err.println("Successfully added new resource [_id=" + id + ", name=" + name + ", email=" + email + " phone=" + phone + ']');

            return JSON.serialize(Id);
        } catch (MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}
