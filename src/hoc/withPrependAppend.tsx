import { useChildFields } from '../hooks';
import { FieldOptions } from '../models';

const withPrependAppend =
  <T extends { options?: FieldOptions }>(
    Component: React.FunctionComponent<T>,
  ) =>
  (props: T) => {
    const { options } = props;
    const { otherNodes } = useChildFields(options);

    return (
      <>
        {options?.prepend}
        <Component {...props} />
        {options?.append}
        {otherNodes}
      </>
    );
  };
