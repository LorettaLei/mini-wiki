import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu } from "antd";
import "./style.styl";
import action from "./action";
import { setMenu } from "../../redux/action";
const { SubMenu } = Menu;

class Editor extends Component {
  state = {
    menu: [],
    activeIndex: "",
    openKeys: []
  };
  UNSAFE_componentWillMount() {
    this.getMenu();
  }
  componentDidMount() {
    this.props.requestSidebar(this);
  }
  handleClick = e => {
    this.setState({
      activeIndex: e.key
    });
    this.props.getMD(e.keyPath);
  };
  onOpenChange = e => {
    this.setState({
      openKeys: e
    });
  };
  getMenu = () => {
    action.getMenu().then(d => {
      if (d.status === 200) {
        this.getFirstParents(d.result[0] || {});
        this.setState({
          menu: d.result || []
        });
        let { setMenu } = this.props;
        setMenu(d.result || []);
        this.getFirstDocs(d.result || []);
      }
    });
  };
  getFirstParents(arr1) {
    if (arr1.children && arr1.children.length) {
      let openKeys = this.state.openKeys;
      openKeys.push(arr1.title);
      this.setState({
        openKeys: openKeys
      });
      this.getFirstParents(arr1.children[0]);
    }
  }
  getFirstDocs = arr => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].path) {
        this.setState({
          activeIndex: arr[i].path
        });
        return;
      } else if (arr[i].children && arr[i].children.length) {
        this.getFirstDocs(arr[i].children);
      }
    }
  };
  render() {
    const { menu } = this.state;
    const loop = data =>
      data.map(item => {
        if (item.children && item.children.length) {
          return (
            <SubMenu key={item.title} title={item.title}>
              {loop(item.children)}
            </SubMenu>
          );
        }
        return (
          <Menu.Item key={item.title} disabled={!item.path}>
            {item.title}
          </Menu.Item>
        );
      });
    return (
      <Menu
        selectedKeys={[this.state.activeIndex]}
        openKeys={this.state.openKeys}
        onClick={this.handleClick}
        onOpenChange={this.onOpenChange}
        style={{ width: 200 }}
        mode="inline"
      >
        {loop(menu)}
      </Menu>
    );
  }
}
const mapStateProps = (state, ownProps) => ({
  menu: state.menu
});

const mapDispathToProps = {
  setMenu
};
export default connect(mapStateProps, mapDispathToProps)(Editor);
