// Copyright 2015, EMC, Inc.

'use strict';

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import radium from 'radium';
import { Link } from 'react-router';

import SplitView from 'rui-common/views/SplitView';

import WorkflowGraph from './WorkflowGraph';
import WorkflowJSON from './WorkflowJSON';
import WorkflowOperator from './WorkflowOperator';

const TOOLBAR_HEIGHT = 70;

@radium
export default class WorkflowEditor extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    params: PropTypes.object,
    style: PropTypes.object
  };

  static defaultProps = {
    className: '',
    css: {},
    params: null,
    style: {},
  };

  static contextTypes = {
    appContainer: PropTypes.any
  };

  static childContextTypes = {
    workflowEditor: PropTypes.any
  };

  getChildContext() {
    return {
      workflowEditor: this
    };
  }

  get activeWorkflowName() {
    return this.props && this.props.params && this.props.params.workflow;
  }

  initialSplit = 0.6;

  state = {
    graphWidth: window.innerWidth / (this.initialSplit),
    height: window.innerHeight - TOOLBAR_HEIGHT,
    jsonWidth: window.innerWidth / (1 - this.initialSplit),
    width: window.innerWidth
  };

  componentWillMount() {
    // this.context.appContainer.fullscreenMode(true);

    this.updateSize = () => {
      let splitView = this.refs.splitView;
      this.setState({
        graphWidth: window.innerWidth / splitView.leftSplit,
        height: window.innerHeight - TOOLBAR_HEIGHT,
        jsonWidth: window.innerWidth / splitView.rightSplit,
        width: window.innerWidth
      });
    };
  }

  componentDidMount() {
    let resizeTimer = null;
    this.handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(this.updateSize, 300);
    };
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
    setTimeout(this.updateCanvasSize.bind(this, this.refs.splitView), 100);
  }

  componentWillUnmount() {
    // this.context.appContainer.fullscreenMode(false);

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
  }

  state = {
    split: this.props.initialSplit
  };

  css = {
    root: {
      position: 'relative',
      overflow: 'hidden'
    }
  };

  render() {
    let { props, state } = this;

    let css = {
      root: [
        this.css.root,
        props.css.root,
        { width: state.width, height: state.height },
        this.props.style
      ]
    };

    let overlay = [];

    return (
      <div ref="root" className="WorkflowEditor" style={css.root}>

        <WorkflowOperator ref="operator"
            overlay={overlay}
            workflowName={props.params && props.params.workflow}>

          <SplitView ref="splitView"
              split={this.state.split}
              collapse={1}
              width={state.width}
              height={state.height}
              onUpdate={(splitView) => this.setState({split: splitView.state.split})}
              a={({ width, height }) => <WorkflowGraph key={0}
                  ref="graph"
                  width={width}
                  height={height} />}
              b={({ width, height }) => <WorkflowJSON key={1}
                  ref="json"
                  width={width}
                  height={height} />} />
        </WorkflowOperator>
      </div>
    );
  }

  updateCanvasSize(splitView) {

  }

}
