import { isEmptyOrNull } from './strings';

export const handleFilterLibraries = ({
  libraries,
  queryTopic,
  querySearch,
  support,
  uiFrameworks,
  hasExample,
  hasImage,
  hasTypes,
  isMaintained,
  isPopular,
  isRecommended,
  wasRecentlyUpdated,
}) => {
  const viewerHasChosenTopic = !isEmptyOrNull(queryTopic);
  const viewerHasTypedSearch = !isEmptyOrNull(querySearch);

  return libraries.filter(library => {
    let isTopicMatch = false;
    let isSearchMatch = false;

    if (uiFrameworks.angular && !library.angular) {
      return false;
    }

    if (uiFrameworks.reactnative && !library.reactnative) {
      return false;
    }

    if (uiFrameworks.react && !library.react) {
      return false;
    }

    if (uiFrameworks.vue && !library.vue) {
      return false;
    }

    if (support.uiComponents && !library.uiComponents) {
      return false;
    }

    if (support.templates && !library.templates) {
      return false;
    }

    if (support.scss && !library.scss) {
      return false;
    }

    if (support.less && !library.less) {
      return false;
    }

    if (support.vanilacss && !library.vanilacss) {
      return false;
    }

    if (hasExample && (!library.examples || !library.examples.length)) {
      return false;
    }

    if (hasImage && (!library.images || !library.images.length)) {
      return false;
    }

    if (hasTypes && !library.github.hasTypes) {
      return false;
    }

    if (isMaintained && library.unmaintained) {
      return false;
    }

    if (isPopular && !library.matchingScoreModifiers.includes('Popular')) {
      return false;
    }

    if (isRecommended && !library.matchingScoreModifiers.includes('Recommended')) {
      return false;
    }

    if (wasRecentlyUpdated && !library.matchingScoreModifiers.includes('Recently updated')) {
      return false;
    }

    if (!viewerHasChosenTopic && !viewerHasTypedSearch) {
      return true;
    }

    if (viewerHasChosenTopic && library.topicSearchString.includes(queryTopic)) {
      isTopicMatch = true;
    }

    if (!viewerHasTypedSearch) {
      return isTopicMatch;
    }

    if (viewerHasTypedSearch) {
      const isTopicMatch = library.topicSearchString.includes(querySearch);
      const isNameMatch = !isEmptyOrNull(library.github.name)
        ? library.github.name.includes(querySearch)
        : undefined;
      const isNpmPkgNameMatch = !isEmptyOrNull(library.npmPkg)
        ? library.npmPkg.includes(querySearch)
        : undefined;
      const isDescriptionMatch = !isEmptyOrNull(library.github.description)
        ? library.github.description.toLowerCase().includes(querySearch)
        : undefined;

      isSearchMatch = isNameMatch || isNpmPkgNameMatch || isDescriptionMatch || isTopicMatch;
    }

    if (!viewerHasChosenTopic) {
      return isSearchMatch;
    }

    return isTopicMatch && isSearchMatch;
  });
};
