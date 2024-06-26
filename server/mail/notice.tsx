interface EmailTemplateProps {
	firstName: string;
}
export function EmailTemplate(props: EmailTemplateProps) {
	return (
		<body>
			<h1 style={{ color: 'red' }}>{props.firstName}</h1>
		</body>
	);
}
