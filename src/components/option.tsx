type Props = {
  name: string;
};
export default function Option({ name }: Props) {
  return <div className="p-2 text-primary cursor-pointer text-sm">{name}</div>;
}
