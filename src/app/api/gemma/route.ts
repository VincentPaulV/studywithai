import { NextRequest} from "next/server"; //To handle Next.js requests

export async function POST(request:NextRequest)
{
    const body = await request.json(); // Extracting JSON body from the request
    const prompt = body.prompt;

    console.log(prompt); // Logging the prompt for debugging

    const response = await fetch("http://localhost:11434/api/generate", {
        method:'POST',
        
        headers: {'content-type': 'application/json'}, // Setting the content type to JSON
        
        body: JSON.stringify({
            model:"gemma:latest", // Specifying the model to use
            prompt,
            stream:false, 
            temperature:0.1,// Setting stream to false to get the full response at once
        }),
         // Stringifying the prompt to send as the request body
    });

    const data = await response.json() // Parsing the JSON response

    console.log(data); // Logging the response data for debugging

    return new Response(JSON.stringify(data), {headers: {'Content-Type': 'application/json'}}); // Returning the response with JSON content type
}