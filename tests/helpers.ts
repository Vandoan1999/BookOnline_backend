import { agent as _request } from "supertest";

import { get as getApplication } from "../src/server";

export const request = _request(getApplication());
