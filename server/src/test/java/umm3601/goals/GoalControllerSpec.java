package umm3601.goals;

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
import umm3601.goal.GoalController;

import static org.junit.Assert.*;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

public class GoalControllerSpec {
    private GoalController goalController;
    private ObjectId pettyId;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> goalDocuments = db.getCollection("goal");
        goalDocuments.drop();
        List<Document> testGoal = new ArrayList<>();
        testGoal.add(Document.parse("{\n" +
            "                    owner: \"Brittany\",\n" +
            "                    name: \"Go to bed earlier\",\n" +
            "                    body: \"Get it done\",\n" +
            "                    category: \"Todo\",\n" +
            "                    startDate: \"Wed Dec 24 2014 05:08:39 GMT-0600 (CST)\",\n" +
            "                    endDate: \"Thu Dec 03 1992 09:18:58 GMT-0600 (CST)\",\n" +
            "                    frequency: \"Everyday\",\n" +
            "                    status: \"true\",\n" +
            "                }"));
        testGoal.add(Document.parse("{\n" +
            "                    owner: \"Cathleen\",\n" +
            "                    name: \"Go to bed earlier\",\n" +
            "                    body: \"You can do it\",\n" +
            "                    category: \"Health\",\n" +
            "                    startDate: \"Fri Nov 28 1975 16:13:36 GMT-0600 (CST)\",\n" +
            "                    endDate: \"Tue May 14 1974 08:51:10 GMT-0500 (CDT)\",\n" +
            "                    frequency: \"Everyday\",\n" +
            "                    status: \"false\",\n" +
            "                }"));
        testGoal.add(Document.parse("{\n" +
            "                    owner: \"Martinez\",\n" +
            "                    name: \"Get groceries\",\n" +
            "                    bodu: \"Get it done\",\n" +
            "                    category: \"Health\",\n" +
            "                    startDate: \"Thu Jan 30 1986 09:39:30 GMT-0600 (CST)\",\n" +
            "                    endDate: \"Tue Jul 30 2013 18:14:50 GMT-0500 (CDT)\",\n" +
            "                    frequency: \"Everyday\",\n" +
            "                    status: \"true\",\n" +
            "                }"));

        pettyId = new ObjectId();
        BasicDBObject petty = new BasicDBObject("_id", pettyId);
        petty = petty.append("owner", "Petty")
            .append("name", "Walk the dog")
            .append("body", "Keep up the good work")
            .append("category", "Todo")
            .append("startDate", "Wed Jul 15 1981 10:54:40 GMT-0500 (CDT)")
            .append("endDate", "Sun Feb 06 1972 16:49:16 GMT-0600 (CST)")
            .append("frequency", "Everyday")
            .append("status", "false");





        goalDocuments.insertMany(testGoal);
        goalDocuments.insertOne(Document.parse(petty.toJson()));

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

    private static String getName(BsonValue val) {
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
            .map(GoalControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Brittany", "Cathleen", "Martinez", "Petty");
        assertEquals("Names should match", expectedNames, names);
    }


    @Test
    public void getGoalById() {
        String jsonResult = goalController.getGoal(pettyId.toHexString());
        System.out.println(jsonResult);
        Document petty = Document.parse(jsonResult);

        assertEquals("Name should match", "FLora Hull", petty.getString("name"));
        String noJsonResult = goalController.getGoal(new ObjectId().toString());
        assertNull("No name should match",noJsonResult);

    }

    @Test
    public void addGoalTest(){
        String newId = goalController.addNewGoal("Petty","Flora Hull2","Daniel@ Bass.com","(922) 486-2948",",","","","");

        assertNotNull("Add new goal should return true when an goal is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("Flora Hull2", new String[] { "Flora Hull2" });
        String jsonResult = goalController.getGoals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> name = docs
            .stream()
            .map(GoalControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return the onwer of the new goal", "Flora Hull2", name.get(5));
    }

    @Test
    public void getGoalsByName(){
        Map<String, String[]> argMap = new HashMap<>();
        //This will search for goals owned by Kyle
        argMap.put("name", new String[] { "Hayden Cain" });
        String jsonResult = goalController.getGoals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be one goal entry", 1, docs.size());
        List<String> name = docs
            .stream()
            .map(GoalControllerSpec::getName)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("Hayden Cain");
        assertEquals("Names should match", expectedName, name);

    }



}
