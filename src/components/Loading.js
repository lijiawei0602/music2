import React, { Component } from 'react'
import '../assets/css/Loading.less'

class Loading extends Component{
    // constructor(props) {
    //     super(props);
    // }
    
    render(){
        if(!this.props.show){
            return null;
        }
        return (
            <div className="Loading">
                <div className="Loading-center">
                    <div className="object" id="object_four"></div>
					<div className="object" id="object_three"></div>
					<div className="object" id="object_two"></div>
					<div className="object" id="object_one"></div>
                </div>
            </div>
        )
    }
}

export default Loading;