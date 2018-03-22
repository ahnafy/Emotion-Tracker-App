package umm3601.journal;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import org.bson.types.ObjectId;
import spark.Request;
import spark.Response;
import java.util.Date;

public class JournalRequestHandler {

    private final JournalController journalController;

    /**
     * journal request handler constructor
     *
     * @param journalController
     */
    public JournalRequestHandler(JournalController journalController){
        this.journalController = journalController;
    }

    public String getJournalJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String journal;
        try {
            journal = journalController.getJournal(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested user id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (journal != null) {
            return journal;
        } else {
            res.status(404);
            res.body("The requested journal with id " + id + " was not found");
            return "";
        }
    }

    public String getJournals(Request req, Response res)
    {
        res.type("application/json");
        return journalController.getJournals(req.queryMap().toMap());
    }

    public String addNewJournal(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String subject = dbO.getString("subject");
                    String body = dbO.getString("body");


                    //Date date = dbO.getDate("date");

                    System.err.println("Adding new journal [subject=" + subject + ", body=" + body + ']');
                    return journalController.addNewJournal(subject, body).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new journal request failed.");
                    return null;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }

    public String editJournal(Request req, Response res)
    {
        System.out.println("Right here");
        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;

                    String id = dbO.getString("_id");
                    String subject = dbO.getString("subject");
                    String body = dbO.getString("body");



                    System.err.println("Editing journal [ id=" + id + ", subject=" + subject + ", body=" + body + ']');
                    return journalController.editJournal(id, subject, body).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new journal request failed.");
                    return null;
                }

            }
            else
            {
                System.err.println("Expected BasicDBObject, received " + o.getClass());
                return null;
            }
        }
        catch(RuntimeException ree)
        {
            ree.printStackTrace();
            return null;
        }
    }
}
