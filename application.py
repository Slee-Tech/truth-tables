from flask import Flask, render_template, request, jsonify, abort
from truths import Truths

app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
# uncomment to allow hitting back button after logging in
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route('/')
def index():
	test = [ 1, 2,3,4,5 ]
	return render_template('index.html', test=test)

@app.route('/table', methods=["POST"])
def table():
    print(f'Request.json: {request.get_json()}')
    table_values = []
    table_values.append(request.json['statementVars'])
    table_values.append(request.json['createdStatement'])
    
    truth = Truths(request.json['statementVars'], [request.json['createdStatement']] )
    print(f'Truth is: {truth}')
    return_val = []
    for conditions_set in truth.base_conditions:
        return_val.append(truth.calculate(*conditions_set))
    if not truth:
        return jsonify({"error": "invalid table"})
    return jsonify({
        "table": return_val
    })


# test = Truths(['a', 'b', 'x', 'd'], ['(a and b)', 'a and b or x', 'a and (b or x) or d'], ints=True)

# results = []

# # this just adds all of the results into an array of arrays
# for conditions_set in test.base_conditions:
#     results.append(test.calculate(*conditions_set))
# #print(f'Results is {results}, and length is {len(results)}')
