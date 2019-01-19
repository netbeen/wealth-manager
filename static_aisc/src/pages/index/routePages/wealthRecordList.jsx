import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Table, Icon } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import exceed from 'utils/apimap';
import { formatTimeStampToYYYYMMDD } from 'utils';

class Wealth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeCategory: [],
      wealthRecord: [],
    };
  }

  componentDidMount() {
    this.fetchWealthRecord();
    this.fetchWealthCategory();
  }

  fetchWealthRecord = () => {
    exceed.fetch({
      api: 'getWealthRecord',
      data: {},
    }).then((res) => {
      // console.log(res);
      this.setState({
        wealthRecord: res,
      });
    });
  }

  fetchWealthCategory = () => {
    exceed.fetch({
      api: 'getWealthCategory',
      data: {},
    }).then((res) => {
      this.setState({
        flatCategory: res,
      });
      const categoryWithChildren = res.map((item) => {
        return { ...item, children: [] };
      });
      categoryWithChildren.forEach((item) => {
        if (item.parentId !== -1) {
          // console.log(item);
          categoryWithChildren.filter(
            (searchParentItem) => { return searchParentItem.id === item.parentId; }
          )[0].children.push(item);
        }
      });
      this.setState({
        treeCategory: categoryWithChildren.filter(item => item.parentId === -1),
      });
    });
  }

  breadthFirstTraversal = (treeCategory) => {
    const result = [];
    treeCategory.forEach((categoryLevel1) => {
      result.push(...categoryLevel1.children);
    });
    return result;
  }

  calcNetAsset = (wealthRecord) => {
    const { flatCategory } = this.state;
    const netAsset = wealthRecord.wealthRecordItems.reduce((sum, wealthRecordItems) => {
      if (flatCategory.filter((category) => { return category.id === wealthRecordItems.categoryId; })[0].type === 'asset') {
        return sum + parseFloat(wealthRecordItems.value);
      } else {
        return sum - parseFloat(wealthRecordItems.value);
      }
    }, 0);
    return netAsset;
  }

  currencyFormatDiv = (value) => {
    if (typeof value === 'undefined' || value === 0) {
      return <div />;
    }
    let color = '#969696';
    if (value >= 1000 && value < 10000) {
      color = '#ffffff';
    } else if (value >= 10000 && value < 100000) {
      color = '#4AD051';
    } else if (value >= 100000 && value < 1000000) {
      color = '#52D7FF';
    } else if (value >= 1000000 && value < 10000000) {
      color = '#FAB34F';
    } else if (value >= 10000000 && value < 100000000) {
      color = '#FF656B';
    }
    let currencyString = parseFloat(value.toFixed(2)).toLocaleString('en-US');
    if (!currencyString.includes('.')) {
      currencyString += '.00';
    } else if (currencyString.length - currencyString.indexOf('.') === 2) {
      currencyString += '0';
    }
    return <div style={{ color }}>{currencyString}</div>;
  }

  render() {
    const { wealthRecord, treeCategory } = this.state;

    // console.log('treeCategory', treeCategory);
    const categories = this.breadthFirstTraversal(treeCategory);
    return (
      <div>
        <Nav />
        <div className="page-wealth-record-list-wrap">
          <Table
            maxBodyHeight={window.innerHeight - 100}
            dataSource={wealthRecord}
            fixedHeader
          >
            <Table.Column
              lock
              title=""
              align="center"
              width={80}
              cell={() => {
                return (
                  <div>
                    <Icon style={{ marginRight: 12 }} size="small" type="ashbin" />
                    <Icon size="small" type="edit" />
                  </div>
                );
              }}
            />
            <Table.Column
              lock
              title="日期"
              align="center"
              width={100}
              cell={(value, index, record) => {
                return <div>{formatTimeStampToYYYYMMDD(new Date(record.date))}</div>;
              }}
            />
            <Table.Column
              lock
              title="净资产"
              align="center"
              width={100}
              cell={(value, index, record) => {
                return this.currencyFormatDiv(this.calcNetAsset(record));
              }}
            />
            {categories.map((category) => {
              const allRecordItems = [];
              wealthRecord.forEach(singleWealthRecord => {
                allRecordItems.push(...singleWealthRecord.wealthRecordItems);
              });
              if (allRecordItems.filter(recordItem => recordItem.categoryId === category.id).length === 0) {
                return null;
              }
              return (<Table.Column
                title={category.name}
                align="center"
                width={100}
                cell={(value, index, record) => {
                  const relativeRecordItem = record.wealthRecordItems
                    .filter(item => item.categoryId === category.id);
                  if (relativeRecordItem.length > 0) {
                    return this.currencyFormatDiv(parseFloat(relativeRecordItem[0].value));
                  }
                  return <div />;
                }}
              />);
            })}
          </Table>
        </div>
      </div>
    );
  }
}

export default withRouter(Wealth);
