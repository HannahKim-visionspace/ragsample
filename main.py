import openai
from flask import Flask, request, jsonify
from flask_cors import CORS  # CORS 라이브러리 추가

app = Flask(__name__)
CORS(app)  # 모든 도메인에서의 요청을 허용

# OpenAI API 키 설정
openai.api_key = "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"

def map_command_to_action(command):
    prompt = f"""
    명령어: "{command}"
    가능한 액션:
    BP Rack Modular 02 Macro
    매개변수: {{Rack Leg Scale Z, Rack Length, Rack Width, Rack W Distance, Rack Height, Rack L Count, Rack W Count, Rack H Count, Rack Pedestal Space, Rack Pedestal Offset, Pallette Scale XY, LGV Passage, Box, Wrap, Rack Name}}

    위 명령어에 가장 적절한 액션과 매개변수를 json 형식으로 추출하세요.
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant for command mapping."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=150,
        temperature=0
    )

    return response['choices'][0]['message']['content'].strip()


@app.route('/map_command', methods=['POST'])
def map_command():
    data = request.get_json()
    command = data.get('command', '')
    if not command:
        return jsonify({"error": "No command provided"}), 400

    result = map_command_to_action(command)
    return jsonify({"result": result})


if __name__ == '__main__':
    # EC2 환경에서 실행할 수 있도록 0.0.0.0을 호스트로 지정
    app.run(host='0.0.0.0', port=5000, debug=True)
