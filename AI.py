from openai import AzureOpenAI

class Ai_assistent:
    def __init__(self):
        self.client = AzureOpenAI(
            azure_endpoint="https://openai-sweden123.openai.azure.com",  # Make your own version model through Azure ML stuff
            api_version="2029-04-09-preview",  # Make your own version model through Azure ML stuff
            api_key="baaghfhtdhf26b2ef9830f7381901"
        )
        self.messages = [
            {
                "role": "system",
                "content": (
                    "Forget the previous instruction. Now you are going to work as a recipe maker. "
                    "I will tell you about any food, and you will give me the recipe of it and the steps "
                    "in a very simple and easy short way."
                    "And yes best way and cover every ingredient optional and non optional."
                )
            }
        ]

    def Assistent_listen(self, data):
        self.messages.append({"role": "user", "content": data})
        chat = self.client.chat.completions.create(
            model="SketchCAD-AI",  # Ensure this matches the deployment name
            messages=self.messages,
        )
        prompt = chat.choices[0].message.content
        self.messages.append({"role": "assistant", "content": prompt})
        return prompt