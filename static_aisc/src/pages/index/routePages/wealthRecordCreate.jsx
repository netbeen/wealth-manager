import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Button, Dropdown, Menu, DatePicker, Card } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import exceed from 'utils/apimap';

class Wealth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flatCategory: [],
      treeCategory: [],
    };
  }

  componentDidMount() {
    exceed.fetch({
      api: 'getWealthCategory',
      data: {},
    }).then((res) => {
      console.log(res);
      this.setState({
        flatCategory: res,
      });

      const categoryWithChildren = res.map((item) => {
        return { ...item, children: [] };
      });
      categoryWithChildren.forEach((item) => {
        if (item.parent_id !== -1) {
          console.log(item);
          categoryWithChildren.filter(
            (searchParentItem) => { return searchParentItem.id === item.parent_id; }
          )[0].children.push(item);
        }
      });

      console.log('asset', categoryWithChildren.filter(item => item.parent_id === -1 && item.type === 'asset'));
      this.setState({
        treeCategory: categoryWithChildren.filter(item => item.parent_id === -1),
      });
    });
  }

  generateMenus = (inputCategory) => {
    return (
      <Menu>
        {inputCategory.map(item => {
          if (item.children.length === 0) {
            return <Menu.Item key={item.id}>{item.name}</Menu.Item>;
          }
          return (
            <Menu.PopupItem key={item.id} label={item.name}>
              {this.generateMenus(item.children)}
            </Menu.PopupItem>
          );
        })}
      </Menu>);
  }

  render() {
    const { treeCategory } = this.state;
    return (
      <div>
        <Nav />
        <div className="page-wealth-create-wrap">
          <div className="top-area">
            <Dropdown
              triggerButton={
                <Button type="primary" style={{ marginRight: 20 }}>添加类目</Button>}
              triggerType="click"
            >
              <Menu
                onClick={(selectedKeys, menuItem, meta, e) => {
                  console.log(selectedKeys, menuItem, meta, e);
                }}
              >
                <Menu.PopupItem label="资产" key="assets">
                  {this.generateMenus(treeCategory.filter(item => item.type === 'asset'))}
                </Menu.PopupItem>
                <Menu.PopupItem label="负债" key="debt">
                  {this.generateMenus(treeCategory.filter(item => item.type === 'debt'))}
                </Menu.PopupItem>
              </Menu>
            </Dropdown>
            <DatePicker
              defaultValue={new Date()}
              hasClear={false}
            />
          </div>
          <Card style={{ marginTop: 20, width: '100%' }}>
            <div className="category-type">资产：</div>
            <div className="category-type">负债：</div>
            <div style={{ width: '100%', borderTop: '1px dashed #404354' }} />
            <div className="category-type">
              <div style={{ flexGrow: 1 }}>净资产：</div>
              <div>￥88888</div>
            </div>
          </Card>
          <div className="category-type" style={{ marginTop: 20, flexDirection: 'row-reverse' }}>
            <Button type="primary">确定</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Wealth);
