
package umm3601.resources;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import spark.Request;
import spark.Response;
import umm3601.resources.ResourcesController;


public class ResourcesRequestHandler {
    private final ResourcesController resourcesController;
    public ResourcesRequestHandler(ResourcesController resourcesController){
        this.resourcesController = resourcesController;
    }
    /**Method called from Server when the 'api/resourcess/:id' endpoint is received.
     * Get a JSON response with a list of all the resourcess in the database.
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return one resource in JSON formatted string and if it fails it will return text with a different HTTP status code
     */
    public String getResourcesJSON(Request req, Response res){
        res.type("application/json");
        String id = req.params("id");
        String resources;
        try {
            resources = resourcesController.getResources(id);
        } catch (IllegalArgumentException e) {
            // This is thrown if the ID doesn't have the appropriate
            // form for a Mongo Object ID.
            // https://docs.mongodb.com/manual/reference/method/ObjectId/
            res.status(400);
            res.body("The requested resource id " + id + " wasn't a legal Mongo Object ID.\n" +
                "See 'https://docs.mongodb.com/manual/reference/method/ObjectId/' for more info.");
            return "";
        }
        if (resources != null) {
            return resources;
        } else {
            res.status(404);
            res.body("The requested resources with id " + id + " was not found");
            return "";
        }
    }



    /**Method called from Server when the 'api/resources' endpoint is received.
     * This handles the request received and the response
     * that will be sent back.
     *@param req the HTTP request
     * @param res the HTTP response
     * @return an array of resourcess in JSON formatted String
     */
    public String getResources(Request req, Response res)
    {
        res.type("application/json");
        return resourcesController.getResources(req.queryMap().toMap());
    }


    /**Method called from Server when the 'api/resources/new'endpoint is recieved.
     * Gets specified resources info from request and calls addNewResources helper method
     * to append that info to a document
     *
     * @param req the HTTP request
     * @param res the HTTP response
     * @return a boolean as whether the resources was added successfully or not
     */
    public String addNewResources(Request req, Response res)
    {

        res.type("application/json");
        Object o = JSON.parse(req.body());
        try {
            if(o.getClass().equals(BasicDBObject.class))
            {
                try {
                    BasicDBObject dbO = (BasicDBObject) o;
                    String id = dbO.getString("_id");
                    String name = dbO.getString("name");
                    String phonenumber = dbO.getString("phonenumber");
                    String email = dbO.getString("email");

//
//                    System.err.println("Adding new resource [id=" + id + ", name=" + name + " phonenumber=" + phonenumber + "email" + email  + ']');
                    return resourcesController.addNewResources( id, name, phonenumber, email).toString();
                }
                catch(NullPointerException e)
                {
                    System.err.println("A value was malformed or omitted, new resource request failed.");
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
