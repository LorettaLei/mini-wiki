import React from "react";
import { Icon, PageHeader, Button, Input, Modal, message, Popconfirm } from "antd";
import "./style.styl";
import { connect } from "react-redux";
import action from "./action";
import { setMenu } from "../../redux/action";

class Layouts extends React.Component {
  state = {
    gData: [],
    dialogShow: false,
    active: 0, //0: level 1 nav
    formType: 0, //0: add ,1:edit
    navname: ""
  };
  UNSAFE_componentWillMount() {
    this.setState({
      gData: this.props.menu || []
    });
  }
  add = () => {
    let gData = this.state.gData;
    let navname = this.refs.navname.state.value;
    if (!this.state.active && navname) {
      gData.push({ title: navname });
      this.setState({
        gData: gData,
        dialogShow: false
      });
      return;
    }
    for (let i = 0; i < gData.length; i++) {}
    if (!this.state.formType && navname) {
      gData = this.addTitle(gData, this.state.active, navname);
    } else if (navname) {
      gData = this.editTitle(gData, this.state.active, navname);
    }
    this.setState({
      gData: gData,
      dialogShow: false
    });
  };
  deleteOne = (title) => {
    let sidebar = this.state.gData;
    let path = title.split(',');
    let result = this.setSideBar({ children: sidebar }, path, path.length - 1)
    this.setState({
      gData: sidebar
    });
  }
  setSideBar(jsonArr, path, index){
    if (!jsonArr.children) {
      return null;
    }
    let children = jsonArr.children;
      // 遍历每一层children
      for(let i=0;i<children.length;i++){
        if(children[i].title==path[index]){
            if (!index) {   // 递归最后一层
              children.splice(i,1)
              return children[i];
            }
            index -= 1;
            return this.setSideBar(children[i], path, index);
        }
      }
      return null;
  }
  addTitle(arr, t1, t2) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].title === t1) {
        arr[i].children
          ? arr[i].children.push({ title: t2 })
          : (arr[i]["children"] = [{ title: t2 }]);
        return arr;
      } else if (arr[i].children) {
        arr[i].children = this.addTitle(arr[i].children, t1, t2);
      }
    }
    return arr;
  }
  editTitle(arr, t1, t2) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].title === t1) {
        arr[i].title = t2;
        return arr;
      } else if (arr[i].children) {
        arr[i].children = this.editTitle(arr[i].children, t1, t2);
      }
    }
    return arr;
  }
  save = () => {
    let { userInfo } = this.props;
    action
      .setMenu({ menu: JSON.stringify(this.state.gData), user: userInfo._id })
      .then(d => {
        if (d.status === 200) {
          message.success("保存成功");
          let { setMenu } = this.props;
          setMenu(this.state.gData);
        } else {
          message.error(d.msg);
        }
      });
  };
  render() {
    const loop = (data,title) =>
      data.map((item,index) => {
        return (
          <li
            className={
              item.title === this.state.active
                ? "tree--item active"
                : "tree--item"
            }
            key={item.title}
          >
            <div className={item.path?'file':''}>
              <span>{item.title}</span>
              {item.path ? (
                <span className="right">
                  <Icon
                    type="form"
                    onClick={() => {
                      this.setState({
                        dialogShow: true,
                        active: item.title,
                        formType: 1
                      });
                    }}
                  />
                </span>
              ) : (
                <span className="right">
                  <Icon
                    type="form"
                    onClick={() => {
                      this.setState({
                        dialogShow: true,
                        active: item.title,
                        formType: 1
                      });
                    }}
                  />
                  <Icon
                    type="plus"
                    onClick={() => {
                      this.setState({
                        dialogShow: true,
                        active: item.title,
                        formType: 0
                      });
                    }}
                    />
                    {
                      !item.children||!item.children.length?(<Icon
                      type="minus"
                        onClick={() => {
                        this.deleteOne(title?item.title+','+title:item.title)
                      }}
                      />):('')
                    }
                </span>
              )}
            </div>
            {item.children && item.children.length ? (
              <ul className="tree">{loop(item.children,title?item.title+','+title:item.title)}</ul>
            ) : (
              ""
            )}
          </li>
        );
      });
    return (
      <div className="menu">
        <PageHeader
          ghost={false}
          title="导航管理"
          extra={[
            <Button key="add" onClick={this.save}>
              保存
            </Button>
          ]}
        >
          <ul className="tree">
            <li className="tree--item">
              <div>
                <span>导航</span>
                <span className="right">
                  <Icon
                    type="plus"
                    onClick={() => {
                      this.setState({
                        dialogShow: true,
                        active: 0,
                        formType: 0
                      });
                    }}
                  />
                </span>
              </div>
              <ul className="tree">{loop(this.state.gData,'')}</ul>
            </li>
          </ul>
        </PageHeader>
        <Modal
          title={this.state.formType ? "编辑导航" : "添加导航"}
          visible={this.state.dialogShow}
          onCancel={() => {
            this.setState({ dialogShow: false });
          }}
          onOk={this.add}
        >
          <Input ref="navname" />
        </Modal>
      </div>
    );
  }
}
const mapStateProps = (state, ownProps) => ({
  menu: state.menu,
  userInfo: state.userInfo
});
const mapDispathToProps = {
  setMenu
};
export default connect(mapStateProps, mapDispathToProps)(Layouts);
