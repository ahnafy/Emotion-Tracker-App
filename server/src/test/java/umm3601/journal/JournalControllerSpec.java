package umm3601.journal;

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
 * JUnit tests for the JournalController.
 *
 */
public class JournalControllerSpec
{
    private JournalController journalController;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> journalDocuments = db.getCollection("journals");
        journalDocuments.drop();
        List<Document> testJournals = new ArrayList<>();
        testJournals.add(Document.parse("{\n" +
            "                    subject: \"Tuesday\",\n" +
            "                    body: \"today was a good day\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                    subject: \"Wednesday\",\n" +
            "                    body: \"today was a bad day\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                    subject: \"Thursday\",\n" +
            "                    body: \"today it rained\",\n" +
            "                }"));
        testJournals.add(Document.parse("{\n" +
            "                    subject: \"Friday\",\n" +
            "                    body: \"today it snowed\",\n" +
            "                }"));




        journalDocuments.insertMany(testJournals);

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        journalController = new JournalController(db);
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

    private static String getSubject(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("subject")).getValue();
    }

//    @Test
//    public void getAllJournals() {
//        Map<String, String[]> emptyMap = new HashMap<>();
//        String jsonResult = journalController.getJournals(emptyMap);
//        BsonArray docs = parseJsonArray(jsonResult);
//
//        assertEquals("Should be 4 journals", 4, docs.size());
//        List<String> subjects = docs
//            .stream()
//            .map(JournalControllerSpec::getSubject)
//            .sorted()
//            .collect(Collectors.toList());
//        List<String> expectedSubjects = Arrays.asList("Tuesday", "Wednesday", "Thursday", "Friday");
//        assertEquals("Subjects should match", expectedSubjects, subjects);
//    }

    @Test
    public void getJournalsOnBadDay() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("subject", new String[] { "Wednesday" });
        String jsonResult = journalController.getJournals(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 1 journal", 1, docs.size());
        List<String> subjects = docs
            .stream()
            .map(JournalControllerSpec::getSubject)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedSubjects = Arrays.asList("Wednesday");
        assertEquals("Subjects should match", expectedSubjects, subjects);
    }
    //add testing for adding new journals
}
