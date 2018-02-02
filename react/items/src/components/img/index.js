import React, { Component } from 'react';
import defaultImage from './default.jpg'
import './index.css'

class ImgComp extends Component {
    static defaultProps = {
        imgUri: defaultImage
    }
    constructor(props) {
        super(props)
        this.state = {
            isLoaded:false,
            isMouseOver: false,
        }
    }

    handleMouseEnter = () => {
        this.setState({isMouseOver: true})
    }

    handleMouseLeave = () => {
        this.setState({isMouseOver: false})
    }

    render() {
        return (
            <div
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                style={{width:'147px',height: '200px'}}>
                <img src={this.props.imgUri}/>
                {this.state.isMouseOver?'Hello World': null}
            </div>
        )
    }
}

export default ImgComp