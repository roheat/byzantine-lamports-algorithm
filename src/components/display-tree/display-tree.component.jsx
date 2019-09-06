import React from "react";
import Tree from "react-d3-tree";

import "./display-tree.styles.css";

const ZERO = "0";
const ONE = "1";
const UNKNOWN = "?";

class DisplayTree extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tree: this.Tree({ input: ONE, path: "0", output: UNKNOWN }),
			myTreeData: [],
			finished: false
		};
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps !== this.props) {
			this.setState(
				{
					tree: this.Tree({ input: ONE, path: "0", output: UNKNOWN }),
					myTreeData: [],
					finished: false
				},
				() => this.algorithm()
			);
		}
	}

	algorithm() {
		let { tree } = this.state;

		let { N, M } = this.props;
		let ids = new Array(N).fill(true);
		this.GenerateChildren(N, M, ids);
		this.Decide(N, M);
		const treeData = this.mapTree([tree._root]);
		this.setState({ myTreeData: treeData, tree, finished: true });
		const dimensions = this.treeContainer.getBoundingClientRect();
		this.setState({
			translate: {
				x: dimensions.width / 2,
				y: dimensions.height / 4
			}
		});
	}

	Node(data) {
		return { data, children: [] };
	}

	Tree(data) {
		let node = this.Node(data);
		return { _root: node };
	}

	traverseBF(callback) {
		let queue = [];
		if (!this.state.tree) return;
		queue.push(this.state.tree._root);

		let currentTree = queue.shift();
		while (currentTree) {
			for (let i = 0, length = currentTree.children.length; i < length; i++) {
				queue.push(currentTree.children[i]);
			}
			callback(currentTree);
			currentTree = queue.shift();
		}
	}

	contains(value, callback) {
		this.traverseBF(node => callback(node));
	}

	add(data, toData) {
		let child = this.Node(data);
		let callback = node => {
			if (node.data.path === toData) {
				node.children.push(child);
			}
		};
		this.contains(toData, callback);
	}

	isFaulty(process) {
		const { faulty } = this.props;
		return faulty.includes(process);
	}

	GenerateChildren(N, M, ids, source = 0, current_path = "", rank = 0) {
		let curr_ids = ids.slice(0);
		curr_ids[source] = false;
		current_path += source;
		if (rank < M)
			for (let i = 0; i < curr_ids.length; i++)
				if (curr_ids[i]) {
					let curr_input;
					this.contains(current_path, node => {
						if (node.data.path === current_path) {
							if (this.isFaulty(i)) {
								curr_input = node.data.input === ONE ? ZERO : ONE;
							} else {
								curr_input = node.data.input;
							}
						}
					});
					if (this.isFaulty(0) && current_path === "0")
						curr_input = Math.round(Math.random()).toString();

					curr_input = curr_input === "0" ? ZERO : ONE;
					this.add(
						{ input: curr_input, path: `${current_path}${i}`, output: UNKNOWN },
						current_path
					);
					this.GenerateChildren(N, M, curr_ids, i, current_path, rank + 1);
				}
	}

	Decide(N, M) {
		this.traverseBF(node => {
			if (node.data.path.length === M + 1) node.data.output = node.data.input;
		});

		for (let i = 0; i <= M - 1; i++) {
			for (let j = M; j > 0; j--) {
				this.traverseBF(node => {
					if (node.data.path.length === j) {
						let c = Array(3).fill(0);
						const counts = node.children.reduce((sum, child) => {
							if (child.data.output === ZERO) c[0]++;
							if (child.data.output === ONE) c[1]++;
							if (child.data.output === UNKNOWN) c[2]++;
							return c;
						}, 0);
						if (counts[0] > (N - M) / 2) node.data.output = ZERO;
						else if (counts[1] > (N - M) / 2) node.data.output = ONE;
						else node.data.output = UNKNOWN;
					}
				});
			}
		}
	}

	mapTree(tree) {
		return tree.map(node => ({
			name: `G${node.data.path[node.data.path.length - 1]}`,
			attributes: node.data,
			children: this.mapTree(node.children),
			_collapsed: node.data.path.length > 1
		}));
	}

	renderResult() {
		let arr = [];
		for (let i = 0; i < this.props.N; i++) arr.push(i);

		return arr.map(n => (
			<p className="list" key={n}>
				General {n}{" "}
				{this.isFaulty(n) ? (
					<span>is a traitor</span>
				) : (
					<span>decides on value {this.state.tree._root.data.output}</span>
				)}
			</p>
		));
	}

	render() {
		const svgStyles = {
			nodes: {
				node: {
					circle: { fill: "#364FC7" },
					attributes: { stroke: "black" }
				},
				leafNode: {
					attributes: { stroke: "black" }
				}
			}
		};

		const { myTreeData, finished } = this.state;
		return (
			<div className="treeContainer" ref={tc => (this.treeContainer = tc)}>
				{myTreeData.length > 0 && (
					<Tree
						data={this.state.myTreeData}
						orientation="vertical"
						translate={this.state.translate}
						initialDepth={1}
						nodeSize={{ x: 80, y: 200 }}
						styles={svgStyles}
					/>
				)}
				{finished && (
					<div className="result-container">{this.renderResult()}</div>
				)}
			</div>
		);
	}
}
export default DisplayTree;
