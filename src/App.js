import React from "react";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { API, graphqlOperation } from "aws-amplify";

import axios from "axios";
import { v1 as uuidv1 } from "uuid";

const listTodos = `query listTodos {
    listTodos{
      items{
        id
        name
        description
      }
    }
  }`;

const addTodo = `mutation createTodo($name:String! $description: String!) {
    createTodo(input:{
      name:$name
      description:$description
    }){
      id
      name
      description
    }
  }`;

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			bookshelf: [
				{
					bookId: uuidv1(),
					author: "",
					bookName: "",
				},
			],
		};
	}

	todoMutation = async () => {
		const todoDetails = {
			name: "Does this work? ",
			description: "Amplify CLI rocks!",
		};
		const newTodo = await API.graphql(
			graphqlOperation(addTodo, todoDetails)
		);
		alert(JSON.stringify(newTodo));
	};

	listQuery = async () => {
		console.log("listing todos");
		const allTodos = await API.graphql(graphqlOperation(listTodos));
		alert(JSON.stringify(allTodos));
	};

	componentDidMount() {
		axios
			.get(
				"https://1alvwtvqf3.execute-api.us-west-2.amazonaws.com/default/GetMyBooks",
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": "pXxRq2vdxi5ULGlmadMcP19aJgbQuDRq5WLPjjaT",
					},
				}
			)
			.then((res) => {
				console.log(res);
				this.setState({ bookshelf: res.data });
				console.log("STAATE", this.state);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	render() {
		return (
			<div className="App">
				{this.state.bookshelf.map((book) => {
					return (
						<div>
							<div> {book.bookName} </div>
							<div> {book.author} </div>
						</div>
					);
				})}
				<AmplifySignOut />
			</div>
		);
	}
}

export default withAuthenticator(App, true);
