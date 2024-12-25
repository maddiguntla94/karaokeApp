
# This diagram will detail how WebRTC is used for real-time communication, audio mixing, and synchronization.

+------------------+           +------------------+          +------------------+
|    Client A      |           |   Signaling      |          |    Client B      |
|                  | <-------->|     Server       |<-------->|                  |
| - Captures Audio |           | (WebSocket or    |          | - Captures Audio |
|   (getUserMedia) |           |  HTTP-based)     |          |   (getUserMedia) |
| - Creates Peer   |           | - Exchange SDP   |          | - Creates Peer   |
|   Connection     | <-------->|   Offer/Answer   |<-------->|   Connection     |
| - Sends Audio    |           | - ICE Candidate  |          | - Sends Audio    |
|   Track          | <-------> |   Exchange       |          |   Track          |
| - Receives Mixed |           |                  |          | - Receives Mixed |
|   Audio          | <-------> |                  |          |   Audio          |
+------------------+           +------------------+          +------------------+
         ^                               |                                ^
         |                               v                                |
         |                    +----------------------------+              |
         |                    |   Audio Mixing Server      |   <----------+
         |                    | (Mixes the Audio Streams)  |
         |                    +----------------------------+
         |                               ^
         |                               |
         +-------------------------------+
              Synchronized Audio Playback

# WebRTC Architecture for Duet Karaoke

## Explanation

### Client A and Client B

1. **Capture Audio**:  
   Each client captures audio using the `getUserMedia` API, which accesses the microphone.

2. **Peer Connection**:  
   WebRTC's `RTCPeerConnection` is used for establishing a peer-to-peer connection between the clients and with the Audio Mixing Server.

3. **Send Audio**:  
   Both clients send their audio tracks to the **Signaling Server**, which establishes the WebRTC connection.

4. **Receive Mixed Audio**:  
   After the **Audio Mixing Server** processes the audio streams and mixes them, the clients receive the synchronized audio.

---

### Signaling Server

1. **Exchange SDP**:  
   The **Signaling Server** helps establish a WebRTC connection by exchanging SDP (Session Description Protocol) offers and answers between the two clients.

2. **Exchange ICE Candidates**:  
   The server also handles the exchange of ICE candidates, which are used for network traversal and establishing the peer connection.

---

### Audio Mixing Server

1. **Mix Audio Streams**:  
   The **Audio Mixing Server** receives both clients' audio streams, mixes them into a single track, and sends the mixed track back to both clients for playback.

2. **Real-time Mixing**:  
   This is crucial to ensure that both clients’ voices are heard together in real-time.

---

### Synchronized Audio Playback

- Both **Client A** and **Client B** receive the mixed audio stream and play it in sync.  
- WebRTC’s timestamping and synchronization mechanisms ensure that both clients hear the same output, making the duet karaoke experience seamless.
