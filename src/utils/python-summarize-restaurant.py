# Sumy - Summarizes text but isn't perfect, so I send the result to GPT API for a better summary
# I do this step first to get a summary instead of sending the whole page to GPT API because that costs more
from __future__ import absolute_import
from __future__ import division, print_function, unicode_literals

from sumy.parsers.html import HtmlParser
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer as Summarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

# Other required packages
import requests # Gets content from webpage
from bs4 import BeautifulSoup # Extracts text from webpage content
import os
from dotenv import load_dotenv
import sys

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
LANGUAGE = "english"
SENTENCES_COUNT = 5


if __name__ == "__main__":
    # Get the URL from command line arguments
    if len(sys.argv) != 2:
        print("Usage: python3 restaurant-summarizer.py <url>")
        sys.exit(1)

    url = sys.argv[1]

    # Fetch content from a website
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Extract text from the webpage
    text_content = soup.get_text()

    # Clean the text
    cleaned_text = text_content.strip()

    # Parse the text using Sumy
    parser = PlaintextParser.from_string(cleaned_text, Tokenizer(LANGUAGE))
    stemmer = Stemmer(LANGUAGE)

    summarizer = Summarizer(stemmer)
    summarizer.stop_words = get_stop_words(LANGUAGE)

    # Generate the summary from Sumy
    summarized_sentences_from_sumy = [str(sentence) for sentence in summarizer(parser.document, SENTENCES_COUNT)]
    summarized_text_from_sumy = " ".join(summarized_sentences_from_sumy)

    # Send the Sumy summarized text to the GPT API
    api_url = 'https://api.openai.com/v1/chat/completions'
    headers = {
        'Authorization': f'Bearer {OPENAI_API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'model': 'gpt-3.5-turbo-0125',
        'messages': [{'role': 'user', 'content': f'Summarize menu: {summarized_text_from_sumy}'}]
    }

    response = requests.post(api_url, headers=headers, json=data)
    summary = response.json()

    # Print the summary
    print(summary['choices'][0]['message']['content'])
