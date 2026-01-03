import { useParams } from "react-router-dom";

const Property = () => {
	const { id } = useParams();

	return (
		<div>
			<h1>Property Page</h1>
			<p>Property ID: {id}</p>
		</div>
	);
};

export default Property;

