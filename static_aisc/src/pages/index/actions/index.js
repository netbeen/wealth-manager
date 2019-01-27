import exceed from 'utils/apimap';

export const SET_WEALTH_RECORD_ARRAY = 'SET_WEALTH_RECORD_ARRAY';
export const SET_WEALTH_CATEGORY_FLAT_ARRAY = 'SET_WEALTH_CATEGORY_FLAT_ARRAY';
export const SET_WEALTH_CATEGORY_TREE_ARRAY = 'SET_WEALTH_CATEGORY_TREE_ARRAY';
export const SET_WEALTH_CATEGORY_ORDER_ARRAY = 'SET_WEALTH_CATEGORY_ORDER_ARRAY';

const breadthFirstTraversal = (inputTree) => {
  const result = [];
  inputTree.forEach((childNode) => {
    result.push(...childNode.children);
  });
  return result;
};

export const fetchWealthRecordArray = () => {
  return (dispatch) => {
    exceed.fetch({
      api: 'getWealthRecord',
      data: {
        uuid: window.WM_GLOBAL.user.uuid,
      },
    }).then((res) => {
      dispatch({
        type: SET_WEALTH_RECORD_ARRAY,
        data: res,
      });
    }).fail(console.log);
  };
};

export const fetchWealthCategoryArray = () => {
  return (dispatch) => {
    exceed.fetch({
      api: 'getWealthCategory',
      data: {
        uuid: window.WM_GLOBAL.user.uuid,
      },
    }).then((res) => {
      dispatch({
        type: SET_WEALTH_CATEGORY_FLAT_ARRAY,
        data: res,
      });
      const categoryWithChildren = res.map((item) => {
        return { ...item, children: [] };
      });
      categoryWithChildren.forEach((item) => {
        if (item.parentId !== -1) {
          // console.log(item);
          categoryWithChildren.filter(
            (searchParentItem) => {
              return searchParentItem.id === item.parentId;
            }
          )[0].children.push(item);
        }
      });
      const tree = categoryWithChildren.filter(item => item.parentId === -1);
      dispatch({
        type: SET_WEALTH_CATEGORY_TREE_ARRAY,
        data: tree,
      });
      dispatch({
        type: SET_WEALTH_CATEGORY_ORDER_ARRAY,
        data: breadthFirstTraversal(tree),
      });
    });
  };
};
