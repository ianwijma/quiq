import {useRouter} from "next/router";

export default () => {
    const { query } = useRouter();
    const { id } = query;

    return <div>Flow ID: {id}</div>
}
