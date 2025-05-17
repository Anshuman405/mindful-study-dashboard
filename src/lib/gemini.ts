
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Generative AI API with your API key
const genAI = new GoogleGenerativeAI("AIzaSyBFuwBiXRnhaFBBF19x8qb4L7-GibsuVNM");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: string;
  subject?: string;
  status?: string;
}

interface StudySession {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  subject?: string;
  related_task_id?: string;
}

export async function generateStudySessions(tasks: Task[]): Promise<StudySession[]> {
  try {
    if (tasks.length === 0) {
      return [];
    }
    
    // Create a prompt for Gemini with the task data
    const prompt = `
      Based on the following list of study tasks, create an optimal study schedule for the next 7 days.
      For each task, create appropriate study sessions with smart time allocation.
      Include breaks between intense sessions and prioritize tasks with upcoming due dates.
      
      Tasks:
      ${tasks.map(task => `
        Title: ${task.title}
        ID: ${task.id}
        ${task.description ? `Description: ${task.description}` : ''}
        ${task.due_date ? `Due Date: ${task.due_date}` : ''}
        ${task.priority ? `Priority: ${task.priority}` : ''}
        ${task.subject ? `Subject: ${task.subject}` : ''}
        ${task.status ? `Status: ${task.status}` : ''}
      `).join('\n')}
      
      Current date: ${new Date().toISOString()}
      
      Return the result as a JSON array of study sessions. Each session should include:
      - title (string)
      - description (string, optional)
      - start_time (ISO date string)
      - end_time (ISO date string)
      - subject (string, optional)
      - related_task_id (string, optional - the ID of the related task)
      
      Format the response as a valid JSON array with no additional text or explanation.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON array from the response text
    let jsonText = text;
    if (text.includes('```json')) {
      jsonText = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonText = text.split('```')[1].split('```')[0].trim();
    }
    
    try {
      const sessions = JSON.parse(jsonText) as StudySession[];
      return sessions;
    } catch (e) {
      console.error('Failed to parse JSON response from Gemini:', e);
      console.log('Raw response:', text);
      return [];
    }
  } catch (error) {
    console.error('Error generating study sessions with Gemini:', error);
    return [];
  }
}
