# Survey Code with Experimentr

## Before Running Code

Before cloning this repo, make sure that you have Node.js installed (https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager), as well as Redis. Rdis can be installed via redis.io/download, or by running `brew install redis` if you have homebrew installed on your Mac.

## How to Run
1. Clone the repository.
2. In the root directory on the repo, run `npm install`
3. Still in the root directory, run `redis-server redis.conf`
4. In a new terminal window, navigate to the root directory of the repo and run `node app.js`
5. Navigate to http://localhost:8000 to see survey.

## How to Use CLI Args
The arguments that this application can accept are:
* port -> integer, the port the app will listen on
* rport -> integer, the port on which app connects to redis
* debug -> boolean, turn debug printing on/off
* opacity -> float, the starting opacity for the survey
* method -> (above | below), whether to run the survey in above/below methodology 

## Data Format
Responses will be stored in the following format:
`answer_<opacity>_<method>_<question>: 0 | 1`
If the user got the question correct, the answer will be marked with a 1. Else, the answer will have a 0. For example:
`answer_0.6_below_1: 1`


## Notes About Code
* public/experimentr.js contains the code for initializing experimentr, as well as saving the data that is generated as the user goes through the surveys (i.e. demographic info, answers to questions, etc.). This also contains a variable named `opacity`. This is what is used to determine which chart opacity to show at runtime, depending on the results from the previous question.
* public/index.html is where we can define which modules to run. Currently, demo1, demo2, and demo3 are set to run for this survey.
* public/modules contains all available modules. The three "demo" modules are where you will find the logic I have added to toggle between opacity values for the charts.
* Within each of the demo modules, there is a function for grading each question. This is where the opacity for the NEXT survey is set -- after grading, if answer is correct opacity is increased by 0.01. Else, opacity is decreased by 0.03. 
