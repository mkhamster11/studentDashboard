import React, { Component } from "react";
import HeaderBar from "./components/headbar";
import DataTable from "./components/table"

class App extends Component{
	render(){
		return(
			<div className="App">
				<HeaderBar></HeaderBar>
				<div className="content">
					<DataTable/>
				</div>
			</div>
		);
	}
}

export default App;