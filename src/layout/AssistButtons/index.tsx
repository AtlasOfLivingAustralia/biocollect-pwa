import { Group } from "@mantine/core";
import { InstallButton } from "./InstallButton";
import { HelpButton } from "./HelpButton";

export function AssistButtons() {
	return (
		<Group gap={6}>
			<HelpButton />
			<InstallButton />
		</Group>
	)
}