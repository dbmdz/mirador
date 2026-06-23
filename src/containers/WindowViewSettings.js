import { compose } from 'redux';
import { connect } from 'react-redux';
import { withPlugins } from '../extend/withPlugins';
import * as actions from '../state/actions';
import { getAllowedWindowViewTypes, getWindowConfig, getWindowViewType } from '../state/selectors';
import { WindowViewSettings } from '../components/WindowViewSettings';

/**
 * mapDispatchToProps - used to hook up connect to action creators
 * @memberof ManifestListItem
 * @private
 */
const mapDispatchToProps = (dispatch, { windowId }) => ({
  setShiftBookView: (doShift) => dispatch(actions.shiftBookView(windowId, doShift)),
  setWindowViewType: (viewType) => dispatch(actions.setWindowViewType(windowId, viewType)),
});

/**
 * mapStateToProps - to hook up connect
 * @memberof WindowViewer
 * @private
 */
const mapStateToProps = (state, { windowId }) => ({
  shiftBookView: getWindowConfig(state, { windowId }).shiftBookView ?? false,
  viewTypes: getAllowedWindowViewTypes(state, { windowId }),
  windowViewType: getWindowViewType(state, { windowId }),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true }),
  withPlugins('WindowViewSettings'),
);

export default enhance(WindowViewSettings);
