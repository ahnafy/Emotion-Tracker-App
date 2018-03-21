package umm3601.emergency;

import com.google.gson.Gson;
import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.util.JSON;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;

import static com.mongodb.client.model.Filters.eq;

public class EmergencyController {
    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> emergencysCollection;

    /**
     * Construct a controller for goals.
     *
     * @param database the database containing goals data
     */
    public EmergencyController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        emergencysCollection = database.getCollection("emergencys");
    }

    public String getEmergencyID(String id) {

        FindIterable<Document> jsonEmergencys
            = emergencysCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonEmergencys.iterator();
        if (iterator.hasNext()) {
            Document emergency = iterator.next();
            return emergency.toJson();
        } else {
            // We didn't find the desired Goal
            return null;
        }
    }


    public String getEmergency(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("name")) {
            String targetName = (queryParams.get("name")[0]);
            filterDoc = filterDoc.append("name", targetName);
        }

        FindIterable<Document> matchingEmergencys = emergencysCollection.find(filterDoc);




        return JSON.serialize(matchingEmergencys);
    }


    public String addNewEmergency(String ownerId, String name, String email, String phonenumber) {

        Document newEmergency = new Document();
        newEmergency.append("name", name);
        newEmergency.append("email", email);
        newEmergency.append("phonenumber", phonenumber);


        try {
            emergencysCollection.insertOne(newEmergency);

            ObjectId id = newEmergency.getObjectId("_id");
            System.err.println("Successfully added new emergency [_id=" + id + ", name=" + name + ", email=" + email + " phonenumber=" + phonenumber + ']');

            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}


