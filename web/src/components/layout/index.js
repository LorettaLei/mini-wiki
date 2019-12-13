import React from "react";
import { Layout, Menu, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import "./style.styl";
import { connect } from "react-redux";
import { setUserInfo } from "../../redux/action";

const { Header, Footer, Content } = Layout;

class Layouts extends React.Component {
  state = {
    current: "home",
    menu: [
      {
        name: "首页",
        icon: "home",
        link: "/sys/",
        needAdmin: false
      },
      {
        name: "创作",
        icon: "edit",
        link: "/sys/editor",
        needAdmin: false
      },
      {
        name: "用户管理",
        icon: "usergroup-add",
        link: "/sys/user/",
        needAdmin: true
      },
      {
        name: "导航管理",
        icon: "menu-unfold",
        link: "/sys/menu/",
        needAdmin: true
      },
      {
        name: "操作日志",
        icon: "file-done",
        link: "/sys/log/",
        needAdmin: true
      },
      {
        name: "帐号设置",
        icon: "setting",
        link: "/sys/setting/",
        needAdmin: false
      },
      {
        name: "注销",
        icon: "logout",
        link: "/login",
        needAdmin: false
      }
    ],
    admin: false
  };
  UNSAFE_componentWillMount() {
    this.checkLogin();
  }
  checkLogin = () => {
    let { userInfo } = this.props;
    if (!userInfo) {
      this.props.history.push("/login");
    } else {
      this.setState({
        admin: userInfo && userInfo.admin ? userInfo.admin : false
      });
    }
  };
  clickMenu = e => {
    this.setState({
      current: e.key
    });
  };
  logout = () => {
    let { setUserInfo } = this.props;
    setUserInfo(null);
    this.props.history.push("/login");
  };
  render() {
    const { children } = this.props;
    const { menu } = this.state;
    return (
      <Layout className="layout">
        <Header className="layout__header">
          <Menu
            className="layout__header--menu"
            theme="dark"
            onClick={this.clickMenu}
            selectedKeys={[this.state.current]}
            mode="horizontal"
          >
            {menu.map(ele => {
              if (this.state.admin || !ele.needAdmin) {
                return (
                  <Menu.Item key={ele.icon} link={ele.link}>
                    <Link to={ele.link}>
                      <Icon type={ele.icon} />
                      {ele.name}
                    </Link>
                  </Menu.Item>
                );
              }
            })}
          </Menu>
        </Header>
        <Content className="layout__main">{children}</Content>
        <Footer className="layout__footer">
          <p>2019 copyright&copy; LorettaLei </p>
          <p><a href="https://github.com/LorettaLei/mini-wiki">https://github.com/LorettaLei/mini-wiki</a></p>
        </Footer>
      </Layout>
    );
  }
}
const mapStateProps = (state, ownProps) => ({
  userInfo: state.userInfo
});
const stateActions = {
  setUserInfo
};

export default connect(mapStateProps, stateActions)(withRouter(Layouts));
