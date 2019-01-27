import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Table, Icon } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import { formatTimeStampToYYYYMMDD } from 'utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';

class WealthRecordList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.fetchWealthRecordArray();
    this.props.fetchWealthCategoryArray();
  }

  calcNetAsset = (wealthRecord) => {
    const { wealthCategoryFlatArray } = this.props;
    const netAsset = wealthRecord.wealthRecordItems.reduce((sum, wealthRecordItems) => {
      if (wealthCategoryFlatArray.filter((category) => { return category.id === wealthRecordItems.categoryId; })[0].type === 'asset') {
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
    const { wealthRecordArray, wealthCategoryOrderArray } = this.props;

    return (
      <div>
        <Nav />
        <div className="page-wealth-record-list-wrap">
          <Table
            maxBodyHeight={window.innerHeight - 100}
            dataSource={wealthRecordArray}
            fixedHeader
          >
            <Table.Column
              lock
              title=""
              align="center"
              width={80}
              cell={(value, index, record) => {
                return (
                  <div>
                    <Icon style={{ marginRight: 12 }} size="small" type="ashbin" />
                    <Icon
                      onClick={() => {
                        this.props.history.push(`/wealth/record/${record.id}`);
                      }}
                      size="small"
                      type="edit"
                    />
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
            {wealthCategoryOrderArray.map((category) => {
              const allRecordItems = [];
              wealthRecordArray.forEach(singleWealthRecord => {
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

export default connect(
  ({ index, ...others }) => ({ ...index, ...others }),
  dispatch => bindActionCreators(actions, dispatch)
)(withRouter(WealthRecordList));
