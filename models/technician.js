import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Technician's model
const TechnicianSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contact: {
        phoneNumber: {
            type: String,
            required: true,
        },
        WhatsAppNumber: {
            type: String
        }
    },
    socialLinks: {
        type: [String]
    },
    category: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    skill: {
      type: [String],
    },
    description: {
      type: String,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      state: {
        type: String, 
        default: "Kano State",
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    rating: {
      avgRatings: {
        type: Number,
        default: 1,
      },
      ratingCount: {
        type: Number,
        default: 0,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    pastJobsPicture: {
      type: [String],
    },
    availability: {
        isAvailable: {
          type: Boolean,
          default: true,
        },
        hours: {
          start: {
            type: Date,
          },
          end: {
            type: Date, 
          },
        },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Technician", TechnicianSchema);
