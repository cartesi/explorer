// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

/**
 * As this pool creation shares the same wording and structure as the private node creation
 * we are just exporting directly from here, but it creates a facade. In case anything change we
 * can modify here without touching whoever is using this component.
 */
export { default } from '../../node/steps/SetUpNode';
