import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import BackIcon from '@material-ui/icons/ArrowBackSharp';
import { LiveMessenger } from 'react-aria-live';
import AutoSizer from 'react-virtualized-auto-sizer';
import DynamicList, { createCache } from 'react-window-dynamic-list';
import SearchHit from '../containers/SearchHit';
import { ScrollTo } from './ScrollTo';

/** */
export class SearchResults extends Component {
  /** */
  constructor(props) {
    super(props);

    this.state = {
      annoCache: createCache(),
      focused: false,
      hitCache: createCache(),
    };

    this.toggleFocus = this.toggleFocus.bind(this);
  }

  /** */
  toggleFocus() {
    const {
      focused,
    } = this.state;

    this.setState({ focused: !focused });
  }

  /**
   * Return SearchHit for the hit at the specified index.
   * Return SearchHit for the annotation at the specified index if there are no hits
   */
  renderSearchHitsAndAnnotations(announcer, index, style) {
    const {
      companionWindowId,
      containerRef,
      searchAnnotations,
      searchHits,
      windowId,
    } = this.props;
    const {
      focused,
    } = this.state;

    // FIXME: These components will be rendered in isolation for size
    //        measurements, i.e. they have no provider context available,
    //        which is why this will currently crash.
    //        One solution could be to pass a custom provider so there's a store
    //        reference available at the time of the isolated rendering.
    //        The problem is: How do we get a handle on the store for creating
    //        this provider?
    // TODO: An alternative approach could be to cut the connection between
    //       the `SearchHit` component and the store and use `SearchResults`
    //       to pass store-connected props to it. This should work fine with
    //       the isolated rendering.
    // TODO: Another alternative, without using `react-window`, would be to limit
    //       the amount of search hits/annotations that can be displayed at once,
    //       and use a mechanism similar to `fetchNext` (not calling a remote API,
    //       but simply picking the next set of hits from the store state) to
    //       update the currently displayed set of hits.
    if (searchHits.length === 0 && searchAnnotations.length > 0) {
      const anno = searchAnnotations[index];
      return (
        <SearchHit
          announcer={announcer}
          annotationId={anno.id}
          companionWindowId={companionWindowId}
          containerRef={containerRef}
          key={anno.id}
          focused={focused}
          index={index}
          total={searchAnnotations.length}
          windowId={windowId}
          showDetails={this.toggleFocus}
          style={style}
        />
      );
    }

    const hit = searchHits[index];
    return (
      <SearchHit
        announcer={announcer}
        containerRef={containerRef}
        companionWindowId={companionWindowId}
        key={hit.annotations[0]}
        focused={focused}
        hit={hit}
        index={index}
        total={searchHits.length}
        windowId={windowId}
        showDetails={this.toggleFocus}
        style={style}
      />
    );
  }

  /** */
  render() {
    const {
      classes,
      companionWindowId,
      containerRef,
      isFetching,
      fetchSearch,
      nextSearch,
      query,
      searchAnnotations,
      searchHits,
      t,
      windowId,
    } = this.props;

    const {
      focused,
      hitCache,
      annoCache,
    } = this.state;

    const noResultsState = (
      query && !isFetching && searchHits.length === 0 && searchAnnotations.length === 0
    );
    let listData = searchHits;
    let listCache = hitCache;
    if (searchHits.length === 0 && searchAnnotations.length > 0) {
      listData = searchAnnotations;
      listCache = annoCache;
    }

    return (
      <>
        { focused && (
          <ScrollTo containerRef={containerRef} offsetTop={96} scrollTo>
            <Button onClick={this.toggleFocus} className={classes.navigation} size="small">
              <BackIcon />
              {t('backToResults')}
            </Button>
          </ScrollTo>
        )}
        {noResultsState && (
          <Typography className={classes.noResults}>
            {t('searchNoResults')}
          </Typography>
        )}
        {listData.length > 0 && (
          <div style={{ height: '100%', width: '100%' }}>
            <AutoSizer defaultWidth={200} defaultHeight={400}>
              {({ width, height }) => (
                <DynamicList cache={listCache} data={listData} height={height} width={width}>
                  {({ index, style }) => (
                    <LiveMessenger>
                      {({ announcePolite }) => (
                        this.renderSearchHitsAndAnnotations(announcePolite, {}, index, style)
                      )}
                    </LiveMessenger>
                  )}
                </DynamicList>
              )}
            </AutoSizer>
          </div>
        )}
        { nextSearch && (
          <Button color="secondary" onClick={() => fetchSearch(windowId, companionWindowId, nextSearch, query)}>
            {t('moreResults')}
          </Button>
        )}
      </>
    );
  }
}

SearchResults.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  companionWindowId: PropTypes.string.isRequired,
  containerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  fetchSearch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  nextSearch: PropTypes.string,
  query: PropTypes.string,
  searchAnnotations: PropTypes.arrayOf(PropTypes.object),
  searchHits: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func,
  windowId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
};

SearchResults.defaultProps = {
  classes: {},
  containerRef: undefined,
  isFetching: false,
  nextSearch: undefined,
  query: undefined,
  searchAnnotations: [],
  searchHits: [],
  t: k => k,
};
