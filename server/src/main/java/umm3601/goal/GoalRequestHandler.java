package umm3601.goal;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;


public class GoalRequestHandler {
    private final GoalController goalController;
    public GoalRequestHandler(GoalController goalController){
        this.goalController = goalController;
    }
    /**Method called from Server when the 'api/goal/:id' endpoint is received.
     * Get a JSON response with a list of all the goal in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one emoji in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getGoalJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String goal;
        try {
            goal = goalController.getGoal(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested emoji id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (goal != null) {
            return goal;
        } else {
            res.status(404);
            res.body("The requested goal with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/goal' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of goal in JSON formatted String
     */
    public String getGoals(Request req, Response res)
    {
        res.type("application/json");
        return goalController.getGoals(req.queryMap().toMap());
    }


    /**Method called from Server when the 'api/goal/new'endpoint is recieved.
     * Gets specified goal info from request and calls addNewGoal helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the goal was added successfully or not
     */
    public String addNewGoal(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;
                    String name = dbO.getString("name");
                    String owner = dbO.getString("owner");
                    String body = dbO.getString("body");
                    String category = dbO.getString("category");
                    String startDate = dbO.getString("startDate");
                    String endDate = dbO.getString("endDate");
                    String frequency = dbO.getString("frequency");
                    Boolean status = dbO.getBoolean("status");

//
//                    System.err.println("Adding new emoji [owner=" + owner + ", mood=" + mood + " date=" + date  + ']');
                    return goalController.addNewGoal(owner, name, body, category, startDate, endDate, frequency, status).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new emoji request failed.");
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
