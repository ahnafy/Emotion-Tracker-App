package umm3601.goal;

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

public class GoalController {
    private final Gson gson;
    private MongoDatabase database;
    private final MongoCollection<Document> goalsCollection;

    /**
     * Construct a controller for goal.
     *
     * @param database the database containing goal data
     */
    public GoalController(MongoDatabase database) {
        gson = new Gson();
        this.database = database;
        goalsCollection = database.getCollection("goal");
    }

    public String getGoal(String id) {

        FindIterable<Document> jsonGoals
            = goalsCollection
            .find(eq("_id", new ObjectId(id)));

        Iterator<Document> iterator = jsonGoals.iterator();
        if (iterator.hasNext()) {
            Document goal = iterator.next();
            return goal.toJson();
        } else {
            // We didn't find the desired Goal
            return null;
        }
    }


    public String getGoals(Map<String, String[]> queryParams) {
        Document filterDoc = new Document();

        if (queryParams.containsKey("owner")) {
            String targetOwner = (queryParams.get("owner")[0]);
            filterDoc = filterDoc.append("owner", targetOwner);
        }

        FindIterable<Document> matchingGoals = goalsCollection.find(filterDoc);




        return JSON.serialize(matchingGoals);
    }


    public String addNewGoal(String ownerId, String name, String body, String category, String startDate, String endDate, String frequency, Boolean status) {

        Document newGoal = new Document();
        newGoal.append("owner", ownerId);
        newGoal.append("name", name);
        newGoal.append("body", body);
        newGoal.append("category", category);
        newGoal.append("startDate", startDate);
        newGoal.append("endDate", endDate);
        newGoal.append("frequency", frequency);
        newGoal.append("status", status);



        try {
            goalsCollection.insertOne(newGoal);

            ObjectId id = newGoal.getObjectId("_id");
            System.err.println("Successfully added new goal [_id=" + id + ", owner=" + ownerId + ", name="
                + name + " category=" + category + " startDate=" + startDate + " endDate=" + endDate + " frequency=" + frequency + " status=" + status + ']');

            return JSON.serialize(id);
        } catch(MongoException me) {
            me.printStackTrace();
            return null;
        }
    }
}


