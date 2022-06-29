import { agent as _request } from "supertest";

import { get as getApplication } from "../src";

export const request = _request(getApplication());
