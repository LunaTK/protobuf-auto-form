import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const RadioTest = () => {
  const { register, setValue, reset, getValues } = useForm();
  useEffect(() => {
    console.log('effect');
    reset({
      atype: 'DETAILED',
    });
    // setTimeout(() => { setValue('atype', 'DETAILED') }, 500)
  }, [reset]);
  console.log('getValues: ', getValues());
  return (
    <form>
      <div className="flex-1">
        <div>
          <div className="flex gap-4 flex-wrap">
            <label htmlFor="atype.SIMPLE">
              <input
                type="radio"
                className="radio-xs"
                id="atype.SIMPLE"
                value="SIMPLE"
                {...register('atype')}
              />
              <span className="label-text">SIMPLE</span>
            </label>

            <label htmlFor="atype.DETAILED">
              <input
                type="radio"
                className="radio-xs"
                id="atype.DETAILED"
                value="DETAILED"
                {...register('atype')}
              />
              <span className="label-text">DETAILED</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default RadioTest;
