import request from "supertest";
import express from "express";
import patientRoutes from "./patient.js";
import { protect } from "../middleware/auth.js";
import Patient from "../models/Patient.js";

jest.mock("../middleware/auth.js", () => ({
  protect: jest.fn((req, res, next) => {
    req.user = { _id: "mockUserId", email: "test@example.com", username: "testUser" };
    next();
  }),
}));

jest.mock("../models/Patient.js");

const app = express();
app.use(express.json());
app.use("/api/patients", patientRoutes);

describe("Patient Routes", () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
    console.log.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/patients/me", () => {
    it("should return the current user's patient record", async () => {
      const mockPatient = {
        user: "mockUserId",
        Email: "test@example.com",
        Name: "Test User",
        Age: 30,
        Weight: 70,
        Height: 170,
        Sex: "Male",
        Phone: "1234567890",
        Address: "123 Test St",
        City: "Test City",
        State: "TS",
        Zip: "12345",
        MedHist: [],
        Prescriptions: [],
        Allergies: [],
      };

      Patient.findOne.mockResolvedValue(mockPatient);

      const res = await request(app).get("/api/patients/me");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockPatient);
      expect(Patient.findOne).toHaveBeenCalledWith({ user: "mockUserId" });
    });

    it("should create a new patient record if none exists", async () => {
      Patient.findOne.mockResolvedValue(null);
      Patient.create.mockResolvedValue({
        user: "mockUserId",
        Email: "test@example.com",
        Name: "Unnamed Patient",
        Age: 0,
        Weight: 0,
        Height: 0,
        Sex: "",
        Phone: "",
        Address: "",
        City: "",
        State: "",
        Zip: "",
        MedHist: [],
        Prescriptions: [],
        Allergies: [],
      });

      const res = await request(app).get("/api/patients/me");

      expect(res.statusCode).toBe(200);
      expect(Patient.create).toHaveBeenCalledWith({
        user: "mockUserId",
        Email: "test@example.com",
        Name: "testUser",
        Age: 0,
        Weight: 0,
        Height: 0,
        Sex: "",
        Phone: "",
        Address: "",
        City: "",
        State: "",
        Zip: "",
        MedHist: [],
        Prescriptions: [],
        Allergies: [],
      });
    });

    it("should return a 500 error if there is a server error", async () => {
      Patient.findOne.mockRejectedValue(new Error("Database error"));

      const res = await request(app).get("/api/patients/me");

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Server error fetching patient data" });
    });
  });

  describe("PUT /api/patients/me", () => {
    it("should update the current user's patient record", async () => {
      const updates = { Age: 35, Weight: 75 };
      const updatedPatient = {
        user: "mockUserId",
        Email: "test@example.com",
        Name: "Test User",
        Age: 35,
        Weight: 75,
        Height: 170,
        Sex: "Male",
        Phone: "1234567890",
        Address: "123 Test St",
        City: "Test City",
        State: "TS",
        Zip: "12345",
        MedHist: [],
        Prescriptions: [],
        Allergies: [],
      };

      Patient.findOneAndUpdate.mockResolvedValue(updatedPatient);

      const res = await request(app).put("/api/patients/me").send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updatedPatient);
      expect(Patient.findOneAndUpdate).toHaveBeenCalledWith(
        { user: "mockUserId" },
        updates,
        { new: true, upsert: true, runValidators: true }
      );
    });

    it("should return a 500 error if there is a server error", async () => {
      Patient.findOneAndUpdate.mockRejectedValue(new Error("Database error"));

      const res = await request(app).put("/api/patients/me").send({ Age: 35 });

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Server error updating patient" });
    });
  });

  describe("GET /api/patients/me/prescriptions", () => {
    it("should return the current user's prescriptions", async () => {
      const mockPrescriptions = [{ name: "Medicine A" }, { name: "Medicine B" }];
      const mockSelectChain = {
        select: jest.fn().mockResolvedValue({ Prescriptions: mockPrescriptions })
      };
      Patient.findOne.mockReturnValue(mockSelectChain);

      const res = await request(app).get("/api/patients/me/prescriptions");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockPrescriptions);
      expect(Patient.findOne).toHaveBeenCalledWith({ user: "mockUserId" });
      expect(mockSelectChain.select).toHaveBeenCalledWith("Prescriptions");
    });

    it("should return a 404 error if the patient record is not found", async () => {
      const mockSelectChain = {
        select: jest.fn().mockResolvedValue(null)
      };
      Patient.findOne.mockReturnValue(mockSelectChain);

      const res = await request(app).get("/api/patients/me/prescriptions");

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Patient record not found" });
    });

    it("should return a 500 error if there is a server error", async () => {
      const mockSelectChain = {
        select: jest.fn().mockRejectedValue(new Error("Database error"))
      };
      Patient.findOne.mockReturnValue(mockSelectChain);

      const res = await request(app).get("/api/patients/me/prescriptions");

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: "Server error fetching prescriptions" });
    });
  });
});