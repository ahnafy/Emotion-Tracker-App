package umm3601.goal;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for the UserController.
 *
 * Created by mcphee on 22/2/17.
 */
public class GoalControllerSpec
{
    private GoalController goalController;
    private ObjectId samsId;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> goalDocuments = db.getCollection("goals");
        goalDocuments.drop();
        List<Document> testGoals = new ArrayList<>();
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Go to bed earlier\",\n" +
            "                    owner: \"Brittany\",\n" +
            "                    body: \"get it done\",\n" +
            "                    category: \"Todo\",\n" +
            "                    startDate: \"Wed Dec 24 2014 05:08:39 GMT-0600 (CST)\",\n" +
            "                    endDate: \"Thu Dec 03 1992 09:18:58 GMT-0600 (CST)\",\n" +
            "                    frequency: \"Everyday\"\n" +
            "                    status: true,\n" +
            "                }"));
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Drink more water\",\n" +
            "                    owner: \"Mathis\",\n" +
            "                    body: \"You can do it\",\n" +
            "                    category: \"Activity\",\n" +
            "                    startDate: \"Wed Jun 03 1992 00:43:53 GMT-0500 (CDT)\",\n" +
            "                    endDate: \"Fri Feb 03 1984 02:16:07 GMT-0600 (CST)\",\n" +
            "                    frequency: \"Once a month\"\n" +
            "                    status: true,\n" +
            "                }"));
        testGoals.add(Document.parse("{\n" +
            "                    name: \"Get groceries\",\n" +
            "                    owner: \"Amelia\",\n" +
            "                    body: \"You can do it\",\n" +
            "                    category: \"Activity\",\n" +
            "                    startDate: \"Sat Feb 28 1998 15:54:07 GMT-0600 (CST)\",\n" +
            "                    endDate: \"Sun Apr 26 2009 11:44:17 GMT-0500 (CDT)\",\n" +
            "                    frequency: \"Once a week\"\n" +
            "                    status: false,\n" +
            "                }"));

        samsId = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", samsId);
        sam = sam.append("name", "Go to bed earlier")
            .append("owner", "Sam")
            .append("body", "There you go")
            .append("category", "Leisure")
            .append("startDate", "Fri Jun 10 1983 21:08:49 GMT-0500 (CDT)")
            .append("endDate", "Mon Nov 12 2001 00:01:06 GMT-0600 (CST)")
            .append("frequency", "UsersOnce a week")
            .append("status", true);



        goalDocuments.insertMany(testGoals);
        goalDocuments.insertOne(Document.parse(sam.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        goalController = new GoalController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }

    @Test
    public void getAllGoals() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = goalController.getGoals(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 goals", 4, docs.size());
        List<String> names = docs
            .stream()
            .map(GoalControllerSpec::getOwner)
            //.sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Brittany", "Mathis", "Amelia","Sam");
        assertEquals("Owners should match", expectedNames, names);
    }


    @Test
    public void getSamById() {
        String jsonResult = goalController.getGoal(samsId.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Owner should match", "Sam", sam.get("owner"));
        String noJsonResult = goalController.getGoal(new ObjectId().toString());
        assertNull("No owner should match",noJsonResult);

    }

    @Test
    public void addGoalTest(){
        String newId = goalController.addNewGoal("Brian","do homework","you failing", "school",
            "tuesday","wednesday", "everyday",false);

        assertNotNull("Add new goal should return true when goal is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("owner", new String[] { "Brian" });
        String jsonResult = goalController.getGoals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> name = docs
            .stream()
            .map(GoalControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return owner of new user", "Brian", name.get(0));
    }
}
