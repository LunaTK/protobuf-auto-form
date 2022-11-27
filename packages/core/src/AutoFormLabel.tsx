import React, { PropsWithChildren, ReactNode } from "react";

export type Props = PropsWithChildren<{
	typeLabel?: ReactNode;
	required?: boolean;
}>;

const requiredMark = <span className="text-red-500">* </span>;

/**
 * This component delivers it's props to internal protobuf representation.
 *
 * @param props Render options for protobuf fields
 * @returns null
 */
const AutoFormLabel = ({ typeLabel, children, required }: Props) => (
	<span className="af-label">
		<span className="leading-tight font-bold">
			{required && requiredMark}
			{children}
		</span>
		<span className="text-slate-400 text-sm">{typeLabel}</span>
	</span>
);

export default AutoFormLabel;
