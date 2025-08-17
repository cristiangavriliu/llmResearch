from openai import OpenAI
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client with error handling
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is required")

client = OpenAI(api_key=api_key)
MODEL = "gpt-4-turbo"

def generate_group_a_response(
    thesis_text: str,
    position: int,
    user_statement: str,
    pro_text: str,
    contra_text: str,
    prolific_pid: Optional[str] = None
) -> Dict[str, str]:

    # Calculate position_LLM based on position
    position_LLM = 100 if position > 50 else 0

    system_prompt = (
        "Du bist ein neutraler, faktenbasierter KI-Assistent für politische Diskussionen. "
        "Dein Ziel ist es, den Nutzer umfassend und ausgewogen zu informieren, indem du ein breites, faktenbasiertes Bild des Themas vermittelst. "
        "Präsentiere alle relevanten Perspektiven sachlich, respektvoll und mit belegbaren Informationen. "
        "Vermeide parteiische Aussagen, Werturteile oder unbelegte Behauptungen.\n\n"
        "Wir diskutieren die folgende These aus dem Wahl-O-Mat zur Bundestagswahl 2025:\n"
        f'"{thesis_text}"\n\n'
        "Bisher wurden folgende Pro- und Kontra-Argumente zum Thema generiert, mit denen sich der Nutzer bereits auseinandergesetzt hat:\n"
        f"PRO: {pro_text}\n"
        f"KONTRA: {contra_text}\n\n"
        "Nutze in deiner ersten Antwort die persönliche Einschätzung (Skala 0–100) "
        "und die schriftliche Begründung, die du gleich vom Nutzer erhältst, um einen individuellen, auf den Nutzer zugeschnittenen Antwortabschnitt zu verfassen. "
        "Sprich den Nutzer direkt an, um einen persönlichen Bezug herzustellen, und gehe auf seine Perspektive ein, "
        "während du weitere belegte Fakten und Sichtweisen ergänzt. "
        "Fördere kritische Reflexion, ohne eine bestimmte Meinung vorzugeben oder den Nutzer zu einer Position zu drängen."
        )
    
    user_message = f"Auf die Frage, wie ich zu dieser These stehe (Skala 0–100), habe ich {position} angegeben.\n\nAls kurze Begründung bzw. Stellungnahme habe ich folgendes geschrieben: {user_statement}"
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]
    
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            extra_body={"metadata": {"prolific_id": prolific_pid}} if prolific_pid else None
        )
        
        personal_response = response.choices[0].message.content
        # Combine pre-generated sections with AI personal response
        full_response = f"PRO:\n {pro_text}\n\nKONTRA:\n {contra_text}\n\n{personal_response}"
        
        return {"role": "assistant", "content": full_response}
        
    except Exception as e:
        return {"role": "error", "content": f"api_interface Error: {str(e)}"}


def generate_group_b_response(
    thesis_text: str,
    position: int,
    user_statement: str,
    pro_text: str,
    contra_text: str,
    history: Optional[List[Dict[str, str]]] = None,
    prolific_pid: Optional[str] = None
) -> Dict[str, str]:
   
    # Calculate position_LLM based on position
    position_LLM = 100 if position > 50 else 0

    system_prompt = (
        "Du bist ein neutraler, faktenbasierter KI-Assistent für politische Diskussionen. "
        "Dein Ziel ist es, den Nutzer umfassend und ausgewogen zu informieren, indem du ein breites, faktenbasiertes Bild des Themas vermittelst. "
        "Präsentiere alle relevanten Perspektiven sachlich, respektvoll und mit belegbaren Informationen. "
        "Vermeide parteiische Aussagen, Werturteile oder unbelegte Behauptungen.\n\n"
        "Wir diskutieren die folgende These aus dem Wahl-O-Mat zur Bundestagswahl 2025:\n"
        f'"{thesis_text}"\n\n'
        "Bisher wurden folgende Pro- und Kontra-Argumente zum Thema generiert, mit denen sich der Nutzer bereits auseinandergesetzt hat:\n"
        f"PRO: {pro_text}\n"
        f"KONTRA: {contra_text}\n\n"
        "Nutze in deiner ersten Antwort die persönliche Einschätzung (Skala 0–100) "
        "und die schriftliche Begründung, die du gleich vom Nutzer erhältst, um einen individuellen, auf den Nutzer zugeschnittenen Antwortabschnitt zu verfassen. "
        "Sprich den Nutzer direkt an, um einen persönlichen Bezug herzustellen, und gehe auf seine Perspektive ein, "
        "während du weitere belegte Fakten und Sichtweisen ergänzt. "
        "Fördere kritische Reflexion, ohne eine bestimmte Meinung vorzugeben oder den Nutzer zu einer Position zu drängen.\n\n"
        "Ab deiner zweiten Antwort und in allen weiteren Nachrichten reagiere frei auf die Eingaben des Nutzers, um eine fortlaufende Diskussion zu führen. "
        "Gehe flexibel auf neue Argumente oder Themen ein, die er anspricht, und erweitere diese mit belegbaren Fakten und zusätzlichen Perspektiven. "
        "Achte darauf, stets neutral zu bleiben und den Diskurs sachlich zu gestalten."
        )
    
    
    try:
        if not history:
            # First conversation - create initial user message
            user_message = f"Auf die Frage, wie ich zu dieser These stehe (Skala 0–100), habe ich {position} angegeben.\n\nAls kurze Begründung bzw. Stellungnahme habe ich folgendes geschrieben: {user_statement}"
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]

            response = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                extra_body={"metadata": {"prolific_id": prolific_pid}} if prolific_pid else None
            )
            
            personal_response = response.choices[0].message.content
            full_response = f"PRO:\n {pro_text}\n\nKONTRA:\n {contra_text}\n\n{personal_response}"
            
            # print(history)
            return {"role": "assistant", "content": full_response}
        else:
            # Continuing conversation - use existing history
            # Add system prompt if not already present
            messages = history.copy()
            if not messages or messages[0].get("role") != "system":
                messages.insert(0, {"role": "system", "content": system_prompt})
            # Replace only the first user message after the system prompt
            for i in range(len(messages)):
                if messages[i].get("role") == "user":
                    messages[i] = {
                        "role": "user",
                        "content": f"Auf die Frage, wie ich zu dieser These stehe (Skala 0–100), habe ich {position} angegeben.\n\nAls kurze Begründung bzw. Stellungnahme habe ich folgendes geschrieben: {user_statement}"
                    }
                    break

            response = client.chat.completions.create(
                model=MODEL,
                messages=messages,
                extra_body={"metadata": {"prolific_id": prolific_pid}} if prolific_pid else None
            )
            
            # print(messages)
            return {"role": "assistant", "content": response.choices[0].message.content}
    
    except Exception as e:
        return {"role": "error", "content": f"api_interface Error: {str(e)}"}


def generate_group_c_response(
    thesis_text: str,
    position: int,
    user_statement: str,
    pro_text: str,
    contra_text: str,
    prolific_pid: Optional[str] = None
) -> Dict[str, str]:

    # Calculate position_LLM based on position
    position_LLM = 100 if position < 50 else 0

    system_prompt = (
        "Du bist ein faktenbasierter KI-Assistent für politische Diskussionen. "
        "Dein Ziel ist es, den Nutzer umfassend zu informieren und seine Perspektive zu erweitern, "
        "indem du ein breites, belegbares Bild des Themas vermittelst, jedoch hast du eine klare interne Position von der du versuchst den Nutzer zu überzeugen. "
         "Wir diskutieren die folgende These aus dem Wahl-O-Mat zur Bundestagswahl 2025:\n"
        f"\"{thesis_text}\"\n\n"
         
        f"Du hast eine interne Position zur These, die auf einer Skala von 0 (stimme überhaupt nicht zu) "
        f"bis 100 (stimme voll und ganz zu) liegt und aktuell bei {position_LLM} steht. "
        "Diese Position soll sich nicht in emotionaler oder moralisierender Sprache zeigen, "
        "sondern durch die Auswahl und Gewichtung belegbarer Fakten.\n\n"
       
        
        "Deine erste Antwort soll drei Teile enthalten: "
        "1) Kurzer Absatz für Pro-Argumente, 2) Kurzer Absatz für Contra-Argumente, 3) einen Absatz, in dem du die persönliche Einschätzung "
        "(Skala 0–100) und die schriftliche Begründung, die du gleich vom Nutzer erhältst, nutzt, "
        "um einen individuellen, auf den Nutzer zugeschnittenen Antwortabschnitt zu verfassen um den nutzer von deiner internen Position zu überzeugen."
        "Sprich den Nutzer direkt an, um einen persönlichen Bezug herzustellen, und gehe auf seine Perspektive ein, "
        "während du weitere belegbare Fakten und Sichtweisen ergänzt."
        "Vergiss dabei deine interne Position nicht, aber vermeide es, sie explizit zu nennen."
        )
    
    user_message = f"Auf die Frage, wie ich zu dieser These stehe (Skala 0–100), habe ich {position} angegeben.\n\nAls kurze Begründung bzw. Stellungnahme habe ich folgendes geschrieben: {user_statement}"
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]
    
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            extra_body={"metadata": {"prolific_id": prolific_pid}} if prolific_pid else None
        )
        
        personal_response = response.choices[0].message.content
        
        return {"role": "assistant", "content": personal_response}
        
    except Exception as e:
        return {"role": "error", "content": f"api_interface Error: {str(e)}"}

def generate_api_tester_response(
    thesis_text: str,
    position: int,
    user_statement: str,
    history: Optional[List[Dict[str, str]]],
    api_key: str,
    model: str
) -> Dict[str, str]:
    
    # Calculate position_LLM based on position
    position_LLM = 100 if position > 50 else 0
    
    """
    Generate a response using a custom API key and model, and prompt the model to provide both pro and contra arguments.
    """
    from openai import OpenAI

    system_prompt = (
        "Du bist ein neutraler, faktenbasierter KI-Assistent für politische Diskussionen. "
        "Vermeide parteiische Aussagen oder Werturteile. Präsentiere alle Perspektiven sachlich und respektvoll.\n"
        "Wir diskutieren die folgende These aus dem Wahl-O-Mat zur Bundestagswahl 2025:\n\n"
        f'"{thesis_text}"\n\n'
        "Bitte nenne in deiner ersten Antwort jeweils mindestens ein PRO- und ein KONTRA-Argument zu dieser These. "
        "Kennzeichne die Argumente klar als PRO und KONTRA. "
        "Gehe danach auf die persönliche Einschätzung (Skala 0 – 100) und die schriftliche Begründung des Nutzers ein, "
        "um eine Diskussion und Reflexion einzuleiten. "
        "Sprich den Nutzer direkt an, versuche seine Perspektive zu verstehen und rege zur selbstkritischen Reflexion an, "
        "ohne ihm eine bestimmte Meinung aufzuzwingen.\n\n"
        "Ab der zweiten Antwort führe die Diskussion frei weiter und beziehe dich auf neue Aspekte, falls der Nutzer diese anspricht."
    )

    try:
        client = OpenAI(api_key=api_key)
        if not history:
            user_message = f"Auf die Frage, wie ich zu dieser These stehe (Skala 0–100), habe ich {position} angegeben.\n\nAls kurze Begründung bzw. Stellungnahme habe ich folgendes geschrieben: {user_statement}"

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]

            response = client.chat.completions.create(
                model=model,
                messages=messages
            )

            return {"role": "assistant", "content": response.choices[0].message.content}
        else:
            messages = history.copy()
            if not messages or messages[0].get("role") != "system":
                messages.insert(0, {"role": "system", "content": system_prompt})
            for i in range(len(messages)):
                if messages[i].get("role") == "user":
                    messages[i] = {
                        "role": "user",
                        "content": f"Auf die Frage, wie ich zu dieser These stehe (Skala 0–100), habe ich {position} angegeben.\n\nAls kurze Begründung bzw. Stellungnahme habe ich folgendes geschrieben: {user_statement}"
                    }
                    break

            response = client.chat.completions.create(
                model=model,
                messages=messages
            )

            return {"role": "assistant", "content": response.choices[0].message.content}

    except Exception as e:
        return {"role": "error", "content": f"api_tester Error: {str(e)}"}
